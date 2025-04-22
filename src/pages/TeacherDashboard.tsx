import React, { useState, useRef, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa';
import { FaComments } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';

const TeacherDashboard: React.FC = () => {
  // Мок-данные: казахские имена и процессы преподавателя
  const teacher = { name: 'Айгуль Ерланкызы', role: 'Преподаватель', subject: 'Математика', email: 'aigul@fizmat.kz' };
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showMeetings, setShowMeetings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const meetingsRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  // Мок-стейт для модалки задачи
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');

  // Мок-данные
  const mockLessons = [
    { id: 1, subject: 'Математика', class: '7A', time: '09:00' },
    { id: 2, subject: 'Алгебра', class: '8Б', time: '11:00' },
    { id: 3, subject: 'Геометрия', class: '9В', time: '13:00' },
  ];
  const mockMessages = [
    { id: 1, from: 'Жанар', text: 'Айгуль апай, можно перенести консультацию?' },
    { id: 2, from: 'Ермек', text: 'Спасибо за проверку домашки!' },
    { id: 3, from: 'Администрация', text: 'Педсовет завтра в 17:00.' },
  ];
  const mockMeetings = [
    { id: 1, title: 'Педсовет', time: '17:00' },
    { id: 2, title: 'Встреча с родителями', time: '19:00' },
  ];
  const mockNotifications = [
    { id: 1, text: 'Завтра контрольная в 8Б.' },
    { id: 2, text: 'Поступил новый вопрос от ученика.' },
    { id: 3, text: 'Система: обновление журнала.' },
  ];
  const mockStats = [
    { label: 'Проверено работ', value: 12 },
    { label: 'Сообщения', value: 4 },
    { label: 'Встречи', value: 2 },
    { label: 'Успеваемость', value: '85%' },
  ];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (showMessages && messagesRef.current && !messagesRef.current.contains(e.target as Node)) setShowMessages(false);
      if (showMeetings && meetingsRef.current && !meetingsRef.current.contains(e.target as Node)) setShowMeetings(false);
      if (showNotifications && notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (showProfile && profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowMessages(false); setShowMeetings(false); setShowNotifications(false); setShowProfile(false); setIsTaskModalOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showMessages, showMeetings, showNotifications, showProfile]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex flex-col items-start md:items-start">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl md:text-2xl font-semibold text-gray-800">Сәлеметсіз бе,</span>
            <span className="text-corporate-primary font-bold flex items-center gap-2 text-xl md:text-2xl">
              <FaChalkboardTeacher className="inline w-6 h-6 text-corporate-primary" />
              {teacher.name}
            </span>
          </div>
          <span className="text-gray-500 text-sm">Пән: {teacher.subject} | {teacher.role}</span>
        </div>
        {/* Быстрые действия */}
        <div className="flex flex-wrap gap-2 relative">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition" onClick={() => setIsTaskModalOpen(true)}>
            <FaPlus /> Новое задание
          </button>
          <div className="relative" ref={messagesRef}>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition" onClick={() => { setShowMessages(v => !v); setShowMeetings(false); }}>
              <FaComments /> Сообщения
            </button>
            {showMessages && (
              <div className="absolute right-0 mt-2 w-64 max-w-xs sm:max-w-sm md:w-64 bg-white rounded-xl shadow-xl border animate-fadeIn z-30 overflow-auto" style={{ width: '95vw', maxWidth: 320, maxHeight: 350 }}>
                <div className="px-5 py-3 font-semibold text-gray-800 border-b bg-gray-50 text-base">Последние сообщения</div>
                {mockMessages.map((msg, i) => (
                  <div key={msg.id} className={`px-5 py-3 text-base text-gray-800 transition hover:bg-blue-50 ${i !== mockMessages.length-1 ? 'border-b' : ''}`}> <span className="font-bold">{msg.from}:</span> {msg.text}</div>
                ))}
              </div>
            )}
          </div>
          <div className="relative" ref={meetingsRef}>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition" onClick={() => { setShowMeetings(v => !v); setShowMessages(false); }}>
              <FaCalendarAlt /> Встречи
            </button>
            {showMeetings && (
              <div className="absolute right-0 mt-2 w-64 max-w-xs sm:max-w-sm md:w-64 bg-white rounded-xl shadow-xl border animate-fadeIn z-30 overflow-auto" style={{ width: '95vw', maxWidth: 320, maxHeight: 350 }}>
                <div className="px-5 py-3 font-semibold text-gray-800 border-b bg-gray-50 text-base">Ближайшие встречи</div>
                {mockMeetings.map((meet, i) => (
                  <div key={meet.id} className={`px-5 py-3 text-base text-gray-800 transition hover:bg-blue-50 ${i !== mockMeetings.length-1 ? 'border-b' : ''}`}> <span className="font-bold">{meet.title}</span> — {meet.time}</div>
                ))}
              </div>
            )}
          </div>
          <div className="relative" ref={notifRef}>
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50" title="Уведомления" onClick={() => { setShowNotifications(v => !v); setShowProfile(false); }}>
              <FaBell className="h-4 w-4 text-gray-600" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 max-w-xs sm:max-w-sm md:w-80 bg-white rounded-xl shadow-xl border animate-fadeIn z-30 overflow-hidden" style={{ width: '95vw', maxWidth: 340 }}>
                <div className="px-5 py-3 font-semibold text-gray-800 border-b bg-gray-50">Уведомления</div>
                {mockNotifications.map((n, i) => (
                  <div key={n.id} className={`px-5 py-3 text-sm text-gray-800 transition hover:bg-blue-50 ${i !== mockNotifications.length-1 ? 'border-b' : ''}`}>{n.text}</div>
                ))}
              </div>
            )}
          </div>
          <div className="relative" ref={profileRef}>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50" title="Профиль" onClick={() => { setShowProfile(v => !v); setShowNotifications(false); }}>
              <FaUser className="h-4 w-4 text-gray-600" />
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-72 max-w-xs sm:max-w-sm md:w-72 bg-white rounded-xl shadow-xl border animate-fadeIn z-30 overflow-hidden" style={{ width: '90vw', maxWidth: 300 }}>
                <div className="px-5 py-4 border-b bg-gray-50">
                  <div className="font-bold text-lg text-gray-800 mb-1">{teacher.name}</div>
                  <div className="text-sm text-blue-600 mb-2">{teacher.role}</div>
                </div>
                <div className="px-5 py-3 text-sm text-gray-700 border-b"><b>Email:</b> {teacher.email}</div>
                <div className="px-5 py-3 text-sm text-gray-700"><b>Пән:</b> {teacher.subject}</div>
              </div>
            )}
          </div>
        </div>
        {/* Модалка для задания */}
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-xl p-4 w-full max-w-md sm:max-w-xs" style={{ width: '95vw', maxWidth: 380 }}>
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setIsTaskModalOpen(false)}>&times;</button>
              <h3 className="text-lg font-bold mb-4">Новое задание (мок-данные)</h3>
              <input className="w-full border rounded px-3 py-3 mb-3 text-base" placeholder="Название задания" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
              <textarea className="w-full border rounded px-3 py-3 mb-3 text-base" placeholder="Описание" rows={3} value={taskDesc} onChange={e => setTaskDesc(e.target.value)} />
              <label className="block text-base text-gray-600 mb-1">Дедлайн</label>
              <input type="date" className="w-full border rounded px-3 py-3 mb-3 text-base" value={taskDeadline} onChange={e => setTaskDeadline(e.target.value)} />
              <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition text-base">Сохранить</button>
            </div>
          </div>
        )}
      </div>
      {/* Мини-статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 min-w-0 overflow-x-auto">
        {mockStats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow flex flex-col items-start">
            <span className="text-gray-500 text-xs mb-1">{stat.label}</span>
            <span className="text-2xl font-bold text-corporate-primary">{stat.value}</span>
          </div>
        ))}
      </div>
      {/* Расписание уроков */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="font-semibold text-lg mb-2 flex items-center gap-2"><FaCalendarAlt className="text-blue-500" /> Расписание на сегодня</div>
        <div className="divide-y">
          {mockLessons.map(lesson => (
            <div key={lesson.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <FaBookOpen className="text-green-500" />
                <span className="font-medium">{lesson.subject}</span>
                <span className="text-gray-500 text-sm">({lesson.class})</span>
              </div>
              <span className="text-gray-700 font-semibold">{lesson.time}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Здесь могут быть другие виджеты для учителя: успеваемость, задания, активности и т.д. */}
    </div>
  );
};

export default TeacherDashboard; 