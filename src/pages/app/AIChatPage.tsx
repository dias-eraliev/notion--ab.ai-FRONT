import React, { useState, useRef, useEffect } from 'react';
import {
  FaRobot,
  FaPaperPlane,
  FaRegCopy,
  FaHistory,
  FaCog,
  FaRegLightbulb,
  FaMicrophone,
  FaStop,
  FaEraser,
  FaRegBookmark,
  FaChevronDown,
  FaImage
} from 'react-icons/fa';

interface Message {
  id: string;
  text: string;
  time: string;
  isAI: boolean;
  type: 'text' | 'code' | 'image';
  codeLanguage?: string;
  imageUrl?: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  time: string;
  messages: Message[];
}

const AIChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Помощь с математикой',
      lastMessage: 'Можешь объяснить теорему Пифагора?',
      time: '14:30',
      messages: []
    },
    {
      id: '2', 
      title: 'Планирование урока',
      lastMessage: 'Составь план урока по биологии',
      time: '12:15',
      messages: []
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const demoMessages: Message[] = [
    {
      id: '1',
      text: 'Здравствуйте! Я ваш AI-ассистент. Чем могу помочь?',
      time: '14:30',
      isAI: true,
      type: 'text'
    },
    {
      id: '2',
      text: 'Можешь объяснить теорему Пифагора простыми словами?',
      time: '14:31',
      isAI: false,
      type: 'text'
    },
    {
      id: '3',
      text: 'Конечно! Теорема Пифагора говорит о том, что в прямоугольном треугольнике квадрат гипотенузы (самой длинной стороны) равен сумме квадратов двух других сторон (катетов). Математически это записывается как: a² + b² = c², где c - гипотенуза, а a и b - катеты.',
      time: '14:31',
      isAI: true,
      type: 'text'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [demoMessages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Здесь будет логика отправки сообщения
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Левая панель - история чатов */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaRobot className="mr-2 text-blue-500" />
            AI Чат
          </h1>
          <button
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            onClick={() => setSelectedConversation(null)}
          >
            Новый чат
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
                selectedConversation === conv.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{conv.title}</span>
                  <span className="text-xs text-gray-500">{conv.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center text-gray-700 hover:text-blue-500 transition-colors"
          >
            <FaCog className="mr-2" />
            Настройки
            <FaChevronDown className={`ml-auto transform ${showSettings ? 'rotate-180' : ''}`} />
          </button>
          {showSettings && (
            <div className="mt-2 space-y-2">
              <button className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">
                Очистить историю
              </button>
              <button className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">
                Изменить модель AI
              </button>
              <button className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">
                Справка
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Правая панель - чат */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Заголовок чата */}
        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <FaRobot className="text-blue-500 mr-2" />
            <h2 className="font-semibold text-gray-800">
              {selectedConversation
                ? conversations.find(c => c.id === selectedConversation)?.title
                : 'Новый чат'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-blue-500 transition-colors">
              <FaRegBookmark />
            </button>
            <button className="text-gray-500 hover:text-blue-500 transition-colors">
              <FaEraser />
            </button>
          </div>
        </div>

        {/* Область сообщений */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {demoMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  msg.isAI
                    ? 'bg-white border border-gray-200'
                    : 'bg-blue-500 text-white'
                }`}
              >
                {msg.type === 'text' && <p>{msg.text}</p>}
                {msg.type === 'code' && (
                  <div className="relative">
                    <pre className="bg-gray-800 text-white p-4 rounded">
                      <code>{msg.text}</code>
                    </pre>
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => navigator.clipboard.writeText(msg.text)}
                    >
                      <FaRegCopy />
                    </button>
                  </div>
                )}
                <div className="mt-2 text-xs text-right">
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Панель ввода */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
              <FaImage />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введите сообщение..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                rows={1}
              />
            </div>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-2 ${
                isRecording ? 'text-red-500' : 'text-gray-500 hover:text-blue-500'
              } transition-colors`}
            >
              {isRecording ? <FaStop /> : <FaMicrophone />}
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`p-2 ${
                message.trim()
                  ? 'text-blue-500 hover:text-blue-600'
                  : 'text-gray-400'
              } transition-colors`}
            >
              <FaPaperPlane />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <FaRegLightbulb className="mr-1" />
              <span>Подсказка: Нажмите Shift + Enter для новой строки</span>
            </div>
            <div className="flex items-center">
              <FaHistory className="mr-1" />
              <span>История сохраняется автоматически</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage; 