from fastapi import WebSocket
from typing import Dict, Set, Optional
import json
import asyncio
import logging
from .config import settings

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        # Активные соединения
        self.active_connections: Dict[str, WebSocket] = {}
        # Подписки на каналы
        self.subscriptions: Dict[str, Set[str]] = {}
        # Очередь сообщений для отложенной отправки
        self.message_queue: Dict[str, list] = {}
        
    async def connect(self, websocket: WebSocket, client_id: str):
        """Установка нового WebSocket соединения"""
        await websocket.accept()
        self.active_connections[client_id] = websocket
        logger.info(f"Client {client_id} connected. Total connections: {len(self.active_connections)}")
        
        # Отправка накопленных сообщений
        if client_id in self.message_queue:
            for message in self.message_queue[client_id]:
                await self.send_personal_message(message, client_id)
            del self.message_queue[client_id]
    
    def disconnect(self, client_id: str):
        """Закрытие WebSocket соединения"""
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            # Удаление клиента из всех подписок
            for subscribers in self.subscriptions.values():
                subscribers.discard(client_id)
            logger.info(f"Client {client_id} disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: str, client_id: str):
        """Отправка сообщения конкретному клиенту"""
        if client_id in self.active_connections:
            websocket = self.active_connections[client_id]
            try:
                await websocket.send_text(message)
                logger.debug(f"Message sent to client {client_id}")
            except Exception as e:
                logger.error(f"Error sending message to client {client_id}: {e}")
                # Сохранение сообщения для повторной отправки
                if client_id not in self.message_queue:
                    self.message_queue[client_id] = []
                self.message_queue[client_id].append(message)
    
    async def broadcast(self, message: str, exclude: Optional[str] = None):
        """Широковещательная рассылка сообщения всем клиентам"""
        disconnected_clients = []
        for client_id, websocket in self.active_connections.items():
            if client_id != exclude:
                try:
                    await websocket.send_text(message)
                except Exception as e:
                    logger.error(f"Error broadcasting to client {client_id}: {e}")
                    disconnected_clients.append(client_id)
        
        # Удаление отключенных клиентов
        for client_id in disconnected_clients:
            self.disconnect(client_id)
    
    async def subscribe(self, client_id: str, channel: str):
        """Подписка клиента на канал"""
        if channel not in self.subscriptions:
            self.subscriptions[channel] = set()
        self.subscriptions[channel].add(client_id)
        logger.info(f"Client {client_id} subscribed to channel {channel}")
    
    async def unsubscribe(self, client_id: str, channel: str):
        """Отписка клиента от канала"""
        if channel in self.subscriptions:
            self.subscriptions[channel].discard(client_id)
            if not self.subscriptions[channel]:
                del self.subscriptions[channel]
            logger.info(f"Client {client_id} unsubscribed from channel {channel}")
    
    async def publish_to_channel(self, channel: str, message: str, exclude: Optional[str] = None):
        """Публикация сообщения в канал"""
        if channel in self.subscriptions:
            disconnected_clients = []
            for client_id in self.subscriptions[channel]:
                if client_id != exclude and client_id in self.active_connections:
                    try:
                        await self.send_personal_message(message, client_id)
                    except Exception as e:
                        logger.error(f"Error publishing to client {client_id}: {e}")
                        disconnected_clients.append(client_id)
            
            # Удаление отключенных клиентов
            for client_id in disconnected_clients:
                self.disconnect(client_id)
    
    async def ping(self):
        """Периодическая проверка соединений"""
        while True:
            disconnected_clients = []
            for client_id, websocket in self.active_connections.items():
                try:
                    await websocket.send_text(json.dumps({"type": "ping"}))
                except Exception as e:
                    logger.error(f"Ping failed for client {client_id}: {e}")
                    disconnected_clients.append(client_id)
            
            # Удаление отключенных клиентов
            for client_id in disconnected_clients:
                self.disconnect(client_id)
            
            await asyncio.sleep(settings.WS_PING_INTERVAL)
    
    def get_channel_subscribers(self, channel: str) -> Set[str]:
        """Получение списка подписчиков канала"""
        return self.subscriptions.get(channel, set())
    
    def get_client_subscriptions(self, client_id: str) -> Set[str]:
        """Получение списка подписок клиента"""
        return {
            channel
            for channel, subscribers in self.subscriptions.items()
            if client_id in subscribers
        }
    
    def get_connection_info(self, client_id: str) -> dict:
        """Получение информации о соединении клиента"""
        return {
            "connected": client_id in self.active_connections,
            "subscriptions": list(self.get_client_subscriptions(client_id)),
            "queued_messages": len(self.message_queue.get(client_id, []))
        } 