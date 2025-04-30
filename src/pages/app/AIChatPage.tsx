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
  FaImage,
  FaVolumeUp,
  FaTimes,
  FaPause,
  FaSquare
} from 'react-icons/fa';
import { spsChatApi } from '../../api/sps-chat';

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

// Интерфейсы для WebRTC и Realtime API
interface RealtimeSession {
  pc: RTCPeerConnection | null;
  dc: RTCDataChannel | null;
  audioElement: HTMLAudioElement | null;
  mediaStream: MediaStream | null;
}

// Интерфейс для ответа транскрипции от Realtime API
interface TranscriptResponse {
  type: string;
  event_id: string;
  response_id: string;
  item_id: string;
  output_index: number;
  content_index: number;
  transcript: string;
}

// Интерфейс для транскрипции ввода пользователя
interface UserInputTranscription {
  type: string;
  event_id: string;
  item_id: string;
  content_index: number;
  transcript: string;
  logprobs?: any[] | null; // Может содержать log probabilities транскрипции или null
}

// Интерфейс для завершенного ответа модели
interface ModelResponse {
  type: string;
  event_id: string;
  response: {
    id: string;
    object: string;
    status: string;
    output: Array<{
      id: string;
      object: string;
      type: string;
      status: string;
      role: string;
      content: Array<{
        type: string;
        transcript: string;
      }>
    }>
  }
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

  // Состояние для Realtime API
  const [realtimeSession, setRealtimeSession] = useState<RealtimeSession>({
    pc: null,
    dc: null,
    audioElement: null,
    mediaStream: null
  });
  const [realtimeText, setRealtimeText] = useState<string>('');
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(false);

  const [demoMessages, setDemoMessages] = useState<Message[]>([
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
  ]);

  // Состояние для анимации записи
  const [recordingAnimation, setRecordingAnimation] = useState<number>(0);

  // Состояние для хранения транскрипций
  const [transcripts, setTranscripts] = useState<TranscriptResponse[]>([]);

  // Состояние для хранения транскрипций пользователя
  const [userTranscriptions, setUserTranscriptions] = useState<UserInputTranscription[]>([]);
  // Состояние для хранения ответов модели
  const [modelResponses, setModelResponses] = useState<ModelResponse[]>([]);

  // Состояние для размера пульсации голосового индикатора
  const [pulseSize, setPulseSize] = useState<number>(100);
  // Состояние для отображения полноэкранного голосового режима
  const [showVoiceOverlay, setShowVoiceOverlay] = useState<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [demoMessages]);

  // Эффект для анимации индикатора записи
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingAnimation(prev => (prev + 1) % 3);
      }, 500);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Инициализация Realtime API сессии
  const initRealtimeSession = async () => {
    try {
      // Получение эфемерного токена с сервера
      const tokenResponse = await spsChatApi.initSession();
      const EPHEMERAL_KEY = tokenResponse.client_secret.value;

      // Создание peer connection
      const pc = new RTCPeerConnection();

      // Настройка для воспроизведения аудио от модели
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;

      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
      };

      // Получение доступа к микрофону и добавление аудиотрека
      const ms = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      pc.addTrack(ms.getTracks()[0]);

      // Сбрасываем транскрипции и ответы при начале новой сессии
      setTranscripts([]);
      setUserTranscriptions([]);
      setModelResponses([]);

      // Настройка канала данных для отправки и получения событий
      const dc = pc.createDataChannel("oai-events");

      dc.addEventListener("message", (e) => {
        // Обработка событий от Realtime API
        try {
          const eventData = JSON.parse(e.data);
          console.log("Realtime event:", eventData);

          // Обработка различных типов событий
          if (eventData.type === 'text.delta') {
            // Перезаписываем текст вместо добавления
            setRealtimeText(eventData.delta?.text || '');
          }
          // Обработка транскрипции аудио модели
          else if (eventData.type === 'response.audio_transcript.done') {
            // Сохраняем транскрипцию
            setTranscripts(prev => [...prev, eventData as TranscriptResponse]);
          }
          // Обработка транскрипции ввода пользователя (ASR через whisper-1)
          else if (eventData.type === 'conversation.item.input_audio_transcription.completed') {
            console.log("Транскрипция пользовательского ввода:", eventData.transcript);

            // Сохраняем транскрипцию пользователя
            setUserTranscriptions(prev => [...prev, eventData as UserInputTranscription]);

            // Добавляем сообщение пользователя в чат для немедленного отображения
            const userMessage: Message = {
              id: eventData.item_id || `user_${Date.now()}`,
              text: eventData.transcript,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isAI: false,
              type: 'text'
            };

            // Добавляем сообщение в реальном времени, чтобы пользователь сразу видел свою речь
            setDemoMessages(prev => {
              // Если последнее сообщение - не от пользователя, добавляем новое
              if (prev.length === 0 || prev[prev.length - 1].isAI) {
                return [...prev, userMessage];
              }
              // Если последнее сообщение от пользователя, обновляем его текст
              // Это помогает избежать дублирования при нескольких событиях транскрипции
              return prev.map((msg, index) =>
                index === prev.length - 1 && !msg.isAI
                  ? { ...msg, text: eventData.transcript }
                  : msg
              );
            });
          }
          // Обработка завершенного ответа
          else if (eventData.type === 'response.done') {
            console.log("Получен полный ответ модели:",
              eventData.response?.output?.[0]?.content?.[0]?.transcript);

            // Сохраняем полный ответ модели
            setModelResponses(prev => [...prev, eventData as ModelResponse]);

            // Если есть транскрипт в ответе, добавляем его в сообщения
            if (eventData.response?.output?.[0]?.content?.[0]?.transcript) {
              const aiResponse: Message = {
                id: eventData.response.output[0].id || `ai_${Date.now()}`,
                text: eventData.response.output[0].content[0].transcript,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isAI: true,
                type: 'text'
              };

              // Добавляем ответ модели в чат
              setDemoMessages(prev => [...prev, aiResponse]);

              // Очищаем текущий реалтайм-текст, так как полный ответ уже добавлен в чат
              setRealtimeText('');
            }
          }
        } catch (error) {
          console.error("Ошибка при обработке события:", error);
        }
      });

      // Инициализация сессии с использованием SDP
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";

      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      const answerSdp = await sdpResponse.text();
      const answer: RTCSessionDescriptionInit = {
        type: 'answer' as RTCSdpType,
        sdp: answerSdp
      };

      await pc.setRemoteDescription(answer);

      // Сохраняем сессию в состоянии
      setRealtimeSession({
        pc,
        dc,
        audioElement: audioEl,
        mediaStream: ms
      });

      setIsRealtimeActive(true);

      // После установки соединения добавляем сообщение в чат
      const systemMessage: Message = {
        id: Date.now().toString(),
        text: 'Голосовой режим активирован. Говорите в микрофон...',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true,
        type: 'text'
      };

      // Заменяем все предыдущие сообщения одним системным сообщением
      setDemoMessages([systemMessage]);

      // Инициализация чата с моделью
      setTimeout(() => {
        sendRealtimeEvent({
          type: "response.create",
          response: {
            modalities: ["text", "audio"],
            instructions: "Ты полезный ассистент. Отвечай коротко и информативно на русском языке."
          }
        });
      }, 1000);

      // Включаем отображение голосового интерфейса
      setShowVoiceOverlay(true);

    } catch (error) {
      console.error("Ошибка при инициализации Realtime сессии:", error);
      setIsRecording(false);
      setShowVoiceOverlay(false);

      // Сообщение об ошибке
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Не удалось активировать голосовой режим. Пожалуйста, проверьте доступ к микрофону и попробуйте снова.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true,
        type: 'text'
      };

      setDemoMessages(prev => [...prev, errorMessage]);
    }
  };

  // Закрытие Realtime сессии
  const closeRealtimeSession = () => {
    try {
      if (realtimeSession.mediaStream) {
        realtimeSession.mediaStream.getTracks().forEach(track => track.stop());
      }

      if (realtimeSession.dc) {
        realtimeSession.dc.close();
      }

      if (realtimeSession.pc) {
        realtimeSession.pc.close();
      }

      // Добавляем финальное сообщение об окончании голосовой сессии
      const sessionEndMessage: Message = {
        id: Date.now().toString() + '_session_end',
        text: 'Голосовая сессия завершена.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true,
        type: 'text'
      };

      // Добавляем сообщение о завершении, сохраняя существующие сообщения
      setDemoMessages(prev => [...prev, sessionEndMessage]);

      // Сбрасываем состояние
      setRealtimeSession({
        pc: null,
        dc: null,
        audioElement: null,
        mediaStream: null
      });

      setRealtimeText('');
      setIsRealtimeActive(false);
      setTranscripts([]);
      setUserTranscriptions([]);
      setModelResponses([]);
      setIsRecording(false);

      // Выключаем отображение голосового интерфейса
      setShowVoiceOverlay(false);
    } catch (error) {
      console.error("Ошибка при закрытии Realtime сессии:", error);
      setShowVoiceOverlay(false);
      setIsRecording(false);
    }
  };

  // Отправка события в Realtime API
  const sendRealtimeEvent = (event: any) => {
    try {
      if (realtimeSession.dc && realtimeSession.dc.readyState === 'open') {
        realtimeSession.dc.send(JSON.stringify(event));
      }
    } catch (error) {
      console.error("Ошибка при отправке события:", error);
    }
  };

  // Обработка нажатия на кнопку микрофона
  const handleMicrophoneClick = async () => {
    if (isRecording) {
      // Закрытие сессии
      closeRealtimeSession();
      setIsRecording(false);
    } else {
      // Запуск сессии
      setIsRecording(true);
      await initRealtimeSession();
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Добавление нового сообщения пользователя
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAI: false,
      type: 'text'
    };

    setDemoMessages(prev => [...prev, newUserMessage]);

    // Здесь должен быть запрос к API и добавление ответа AI
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Это демо-ответ на ваше сообщение. В реальном приложении здесь будет ответ от AI.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true,
        type: 'text'
      };

      setDemoMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Компонент индикатора записи
  const RecordingIndicator = () => {
    const dots = '.'.repeat(recordingAnimation + 1);
    return (
      <div className="flex items-center text-red-500 mt-2 animate-pulse">
        <FaVolumeUp className="mr-2" />
        <span>Запись{dots}</span>
      </div>
    );
  };

  // Обновляем компонент VoiceOverlay для увеличения эквалайзера и добавления более плавной анимации
  const VoiceOverlay = () => {
    const [bars, setBars] = useState<number[]>([10, 20, 15, 25, 10, 30, 20, 15, 25, 35]);

    useEffect(() => {
      const interval = setInterval(() => {
        setBars(bars.map(() => Math.floor(Math.random() * 100) + 20));
      }, 150);

      return () => clearInterval(interval);
    }, [bars]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center">
        {/* Верхняя часть с инструкцией */}
        <div className="absolute top-8 left-0 right-0 text-center text-white text-xl">
          <p>Говорите, чтобы продолжить диалог</p>
        </div>

        {/* Центральный футуристичный эквалайзер */}
        <div className="relative flex items-center space-x-4">
          {bars.map((height, index) => (
            <div
              key={index}
              className="bg-green-500 rounded transition-all duration-200 ease-in-out"
              style={{ width: '30px', height: `${height}px` }}
            ></div>
          ))}
        </div>

        {/* Сообщение внизу */}
        <div className="absolute bottom-32 left-0 right-0 text-center text-white text-lg">
          <p>Завершите фразу, чтобы отправить</p>
        </div>

        {/* Кнопки управления */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center space-x-24">
          <button
            className="bg-gray-600 w-16 h-16 rounded-full flex items-center justify-center text-white"
            onClick={() => closeRealtimeSession()}
          >
            <FaSquare className="text-xl" />
          </button>

          <button
            className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center text-white"
            onClick={() => closeRealtimeSession()}
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Отображение текущего ответа */}
        {realtimeText && (
          <div className="absolute top-24 left-8 right-8 max-h-64 overflow-y-auto bg-gray-800 bg-opacity-80 p-4 rounded-lg text-white">
            <p>{realtimeText}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Голосовой оверлей */}
      {showVoiceOverlay && <VoiceOverlay />}

      {/* Левая панель - история чатов */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaRobot className="mr-2 text-[#1E5945]" />
            AI Чат
          </h1>
          <button
            className="w-full py-3 px-4 bg-[#1E5945] hover:bg-[#1E5945]/90 text-white rounded-lg font-medium transition-colors"
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
              className={`flex items-center p-4 hover:bg-[#1E5945]/10 cursor-pointer ${selectedConversation === conv.id ? 'bg-[#1E5945]/10' : ''}`}
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
            className="flex items-center text-gray-700 hover:text-[#1E5945] transition-colors"
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
            <FaRobot className="text-[#1E5945] mr-2" />
            <h2 className="font-semibold text-gray-800">
              {selectedConversation
                ? conversations.find(c => c.id === selectedConversation)?.title
                : 'Новый чат'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            {isRecording && <RecordingIndicator />}
            <button className="text-gray-500 hover:text-[#1E5945] transition-colors">
              <FaRegBookmark />
            </button>
            <button className="text-gray-500 hover:text-[#1E5945] transition-colors">
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
                className={`max-w-[70%] rounded-lg p-4 ${msg.isAI
                  ? 'bg-white border border-gray-200'
                  : 'bg-[#1E5945] text-white'}`}
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

          {/* Показываем текущий текст из Realtime API, если он есть */}
          {isRealtimeActive && realtimeText && (
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-lg p-4 bg-white border border-gray-200">
                <p>{realtimeText}</p>
                <div className="mt-2 text-xs text-right">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Панель ввода */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-500 hover:text-green-500 transition-colors"
              disabled={isRealtimeActive}
            >
              <FaImage />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isRealtimeActive ? "Голосовой режим активен..." : "Введите сообщение..."}
                className={`w-full px-4 py-2 border ${isRealtimeActive ? 'bg-gray-100' : 'bg-white'} border-gray-200 rounded-lg focus:outline-none focus:border-green-500 resize-none`}
                rows={1}
                disabled={isRealtimeActive}
              />
            </div>
            <button
              onClick={handleMicrophoneClick}
              className={`p-2 rounded-full ${isRecording
                ? 'text-white bg-red-500 hover:bg-red-600'
                : 'text-gray-500 hover:text-green-500'} transition-colors`}
              title={isRecording ? "Остановить запись" : "Начать запись"}
            >
              {isRecording ? <FaStop /> : <FaMicrophone />}
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isRealtimeActive}
              className={`p-2 ${message.trim() && !isRealtimeActive
                ? 'text-green-500 hover:text-green-600'
                : 'text-gray-400'} transition-colors`}
            >
              <FaPaperPlane />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <FaRegLightbulb className="mr-1" />
              <span>
                {isRealtimeActive
                  ? "Голосовой режим активен. Говорите в микрофон."
                  : "Подсказка: Нажмите Shift + Enter для новой строки"}
              </span>
            </div>
            <div className="flex items-center">
              <FaHistory className="mr-1" />
              <span>{isRealtimeActive ? "Нажмите на микрофон для завершения" : "История сохраняется автоматически"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Добавляем стили анимации в начало файла
const styles = `
@keyframes pulse-slow {
  0% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(1.05); opacity: 0.2; }
  100% { transform: scale(1); opacity: 0.1; }
}

@keyframes pulse-medium {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

@keyframes pulse-fast {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.animate-pulse-slow {
  animation: pulse-slow 3s infinite ease-in-out;
}

.animate-pulse-medium {
  animation: pulse-medium 2s infinite ease-in-out;
}

.animate-pulse-fast {
  animation: pulse-fast 1.5s infinite ease-in-out;
}
`;

// Добавляем стили в DOM
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default AIChatPage;