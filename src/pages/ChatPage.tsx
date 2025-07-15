import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaEllipsisH, FaPaperclip, FaSmile, FaMicrophone, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  status?: 'sent' | 'delivered' | 'read';
  attachments?: { type: string; url: string; name: string }[];
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  avatar: string;
}

const ChatPage: React.FC = () => {
  const location = useLocation();
  const recipientId = location.state?.recipientId;
  
  const [selectedChat, setSelectedChat] = useState<string | null>(recipientId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'Команда учителей',
      content: 'Добрый день! Напоминаем, что завтра состоится собрание.',
      timestamp: '10:00 AM',
      isMe: false
    },
    {
      id: '2',
      sender: 'Вы',
      content: 'Спасибо за напоминание! Обязательно буду.',
      timestamp: '10:05 AM',
      isMe: true
    },
    {
      id: '3',
      sender: 'Команда учителей',
      content: 'Если есть вопросы, пишите.',
      timestamp: '10:10 AM',
      isMe: false
    }
  ]);

  // Пример данных чатов
  const chats: Chat[] = [
    {
      id: '1',
      name: 'Буробай Диас',
      lastMessage: 'Как прошла презентация?',
      timestamp: '8:16 PM',
      unread: 0,
      online: true,
      avatar: 'https://placekitten.com/40/40'
    },
    {
      id: '2',
      name: 'Сайлекова Балга',
      lastMessage: 'Пытается...',
      timestamp: 'Вчера',
      unread: 0,
      online: false,
      avatar: 'https://placekitten.com/41/41'
    },
    {
      id: '3',
      name: 'Цой Дмитрий',
      lastMessage: 'Спасибо',
      timestamp: '10:20 PM',
      unread: 0,
      online: true,
      avatar: 'https://placekitten.com/42/42'
    },
    {
      id: '4',
      name: 'Учебный план',
      lastMessage: 'Обсудим изменения в расписании?',
      timestamp: 'Сегодня',
      unread: 2,
      online: true,
      avatar: 'https://placekitten.com/43/43'
    },
    {
      id: '5',
      name: 'Кураторская группа',
      lastMessage: 'Не забудьте про собрание в пятницу.',
      timestamp: 'Сегодня',
      unread: 1,
      online: false,
      avatar: 'https://placekitten.com/44/44'
    },
    {
      id: '6',
      name: 'Методический совет',
      lastMessage: 'Нужно утвердить новый учебный план.',
      timestamp: 'Вчера',
      unread: 0,
      online: true,
      avatar: 'https://placekitten.com/45/45'
    }
  ];

  // Добавлены моковые сообщения для новых чатов
  const mockMessages: { [key: string]: ChatMessage[] } = {
    '4': [
      {
        id: '1',
        sender: 'Учебный план',
        content: 'Привет! Обсудим изменения в расписании?',
        timestamp: '10:00 AM',
        isMe: false
      },
      {
        id: '2',
        sender: 'Рахмат Кенжибаев',
        content: 'Да, конечно. Какие изменения предлагаете?',
        timestamp: '10:05 AM',
        isMe: true,
        status: 'read'
      }
    ],
    '5': [
      {
        id: '1',
        sender: 'Кураторская группа',
        content: 'Не забудьте про собрание в пятницу.',
        timestamp: '9:00 AM',
        isMe: false
      },
      {
        id: '2',
        sender: 'Рахмат Кенжибаев',
        content: 'Спасибо за напоминание!',
        timestamp: '9:10 AM',
        isMe: true,
        status: 'read'
      }
    ],
    '6': [
      {
        id: '1',
        sender: 'Методический совет',
        content: 'Нужно утвердить новый учебный план.',
        timestamp: '8:00 AM',
        isMe: false
      },
      {
        id: '2',
        sender: 'Рахмат Кенжибаев',
        content: 'Хорошо, я подготовлю документы.',
        timestamp: '8:15 AM',
        isMe: true,
        status: 'read'
      }
    ]
  };

  useEffect(() => {
    if (recipientId) {
      setSelectedChat(recipientId);
    }
  }, [recipientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (message.trim() || selectedFiles.length > 0) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'Рахмат Кенжибаев',
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        status: 'sent',
        attachments: selectedFiles.map(file => ({
          type: file.type,
          url: URL.createObjectURL(file),
          name: file.name
        }))
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      setSelectedFiles([]);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleVoiceRecord = () => {
    if (!isRecording) {
      // Здесь будет логика начала записи
      setIsRecording(true);
    } else {
      // Здесь будет логика окончания записи
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    setMessages([
      {
        id: '1',
        sender: 'Команда учителей',
        content: 'Добрый день! Напоминаем, что завтра состоится собрание.',
        timestamp: '10:00 AM',
        isMe: false
      },
      {
        id: '2',
        sender: 'Вы',
        content: 'Спасибо за напоминание! Обязательно буду.',
        timestamp: '10:05 AM',
        isMe: true
      },
      {
        id: '3',
        sender: 'Команда учителей',
        content: 'Если есть вопросы, пишите.',
        timestamp: '10:10 AM',
        isMe: false
      }
    ]);
  }, []);

  return (
    <div className="h-screen flex bg-[#1E5945]">
      {/* Левая панель со списком чатов */}
      <div className="w-full md:w-[300px] border-r border-[#E5E5E5] bg-[#FAFAFA] md:block" style={{ display: selectedChat ? 'none' : 'block' }}>
        <div className="p-5">
          <h1 className="text-xl font-medium text-[#37352F] mb-4">Все Чаты</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск..."
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E5E5E5] rounded-md pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-[#E5E5E5] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-[11px] text-[#9B9B9B] w-4 h-4" />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`px-5 py-3 cursor-pointer transition-all hover:bg-[#EBEAEA] ${
                selectedChat === chat.id ? 'bg-[#EBEAEA]' : ''
              }`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#E5E5E5]"
                  />
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#2ECC71] rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[#37352F] truncate text-sm">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-[#9B9B9B]">{chat.timestamp}</span>
                  </div>
                  <p className="text-sm text-[#9B9B9B] truncate mt-0.5">{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Правая панель с чатом */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col bg-[#FFFFFF]">
          {/* Шапка чата */}
          <div className="px-5 py-4 border-b border-[#E5E5E5] flex items-center justify-between bg-[#FAFAFA]">
            <div className="flex items-center gap-3">
              <img
                src={chats.find(c => c.id === selectedChat)?.avatar}
                alt="Chat avatar"
                className="w-10 h-10 rounded-full object-cover border border-[#E5E5E5]"
              />
              <div>
                <h2 className="font-medium text-[#37352F] text-sm">
                  {chats.find(c => c.id === selectedChat)?.name}
                </h2>
                <p className="text-xs text-[#9B9B9B]">В сети</p>
              </div>
            </div>
            <button className="text-[#9B9B9B] hover:text-[#37352F] transition-colors">
              <FaEllipsisH className="w-4 h-4" />
            </button>
          </div>

          {/* Область сообщений */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.isMe
                      ? 'bg-[#1C7E66] text-white'
                      : 'bg-[#F7F7F7] text-[#37352F]'
                  }`}
                >
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mb-2 space-y-2">
                      {message.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FaPaperclip className={message.isMe ? 'text-white opacity-80' : 'text-[#9B9B9B]'} />
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${
                              message.isMe ? 'text-white hover:underline' : 'text-[#1C7E66] hover:underline'
                            }`}
                          >
                            {attachment.name}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <div className={`text-xs mt-1.5 flex items-center gap-1 ${
                    message.isMe ? 'text-white opacity-80' : 'text-[#9B9B9B]'
                  }`}>
                    {message.timestamp}
                    {message.isMe && message.status && (
                      <span className="ml-1">✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Область прикрепленных файлов */}
          {selectedFiles.length > 0 && (
            <div className="px-5 py-3 border-t border-[#E5E5E5] bg-[#FAFAFA]">
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-[#E5E5E5]"
                  >
                    <span className="text-sm text-[#37352F] truncate max-w-xs">{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-[#9B9B9B] hover:text-[#37352F] transition-colors"
                    >
                      <FaTimes className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Поле ввода сообщения */}
          <div className="p-5 border-t border-[#E5E5E5] bg-[#FAFAFA]">
            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleFileSelect}
              />
              <button
                className="text-[#9B9B9B] hover:text-[#37352F] transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaPaperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                placeholder={isRecording ? `Запись: ${formatRecordingTime(recordingTime)}` : "Введите сообщение..."}
                className="flex-1 px-4 py-2 bg-white border border-[#E5E5E5] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#E5E5E5] transition-all placeholder-[#9B9B9B]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isRecording}
              />
              <button
                className={`text-[#9B9B9B] hover:text-[#37352F] transition-colors ${
                  isRecording ? 'text-red-500' : ''
                }`}
                onClick={handleVoiceRecord}
              >
                <FaMicrophone className="w-4 h-4" />
              </button>
              <button
                className="text-[#1C7E66] hover:text-[#145A4D] transition-colors disabled:opacity-50"
                onClick={handleSendMessage}
                disabled={isRecording}
              >
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
          <p className="text-[#9B9B9B] text-sm">Выберите чат для начала общения</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
