import React, { useState, useRef, useEffect } from 'react';
import { FaBook, FaCalendarAlt, FaComments, FaBell, FaUser, FaClipboardCheck, FaChartLine } from 'react-icons/fa';

const StudentDashboard: React.FC = () => {
  // Мок-данные: казахские имена и процессы студента
  const student = { name: 'Ерасыл Нурланулы', class: '8Б', email: 'erasyl@fizmat.kz' };
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Мок-данные
  const mockSchedule = [
    { id: 1, subject: 'Математика', time: '09:00', room: '201' },
    { id: 2, subject: 'Физика', time: '10:40', room: '203' },
    { id: 3, subject: 'История', time: '12:20', room: '105' },
  ];
  const mockHomework = [
    { id: 1, subject: 'Математика', task: 'Решить задачи №1-10', due: '2025-04-21' },
    { id: 2, subject: 'Физика', task: 'Подготовить доклад', due: '2025-04-22' },
  ];
  const mockMessages = [
    { id: 1, from: 'Айгуль апай', text: 'Не забудь сдать домашку!' },
    { id: 2, from: 'Куратор', text: 'Завтра классный час в 15:00.' },
  ];
  const mockNotifications = [
    { id: 1, text: 'Внимание: завтра контрольная по математике.' },
    { id: 2, text: 'Добавлено новое домашнее задание.' },
  ];
  const mockStats = [
    { label: 'Домашние задания', value: mockHomework.length },
    { label: 'Сообщения', value: mockMessages.length },
    { label: 'Успеваемость', value: '91%' },
    { label: 'Посещаемость', value: '100%' },
  ];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (showMessages && messagesRef.current && !messagesRef.current.contains(e.target as Node)) setShowMessages(false);
      if (showNotifications && notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (showProfile && profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowMessages(false); setShowNotifications(false); setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showMessages, showNotifications, showProfile]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex flex-col items-start md:items-start">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl md:text-2xl font-semibold text-gray-800">Сәлем,</span>
            <span className="text-corporate-primary font-bold flex items-center gap-2 text-xl md:text-2xl">
              <FaUser className="inline w-6 h-6 text-corporate-primary" />
              {student.name}
            </span>
          </div>
          <span className="text-gray-500 text-sm">Класс: {student.class}</span>
        </div>
        {/* Быстрые действия */}
        <div className="flex flex-wrap gap-2 relative">
          <div className="relative" ref={messagesRef}>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition" onClick={() => { setShowMessages(v => !v); }}>
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
                  <div className="font-bold text-lg text-gray-800 mb-1">{student.name}</div>
                  <div className="text-sm text-blue-600 mb-2">Ученик</div>
                </div>
                <div className="px-5 py-3 text-sm text-gray-700 border-b"><b>Email:</b> {student.email}</div>
                <div className="px-5 py-3 text-sm text-gray-700"><b>Класс:</b> {student.class}</div>
              </div>
            )}
          </div>
        </div>
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
      {/* Расписание */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="font-semibold text-lg mb-2 flex items-center gap-2">{FaCalendarAlt && React.createElement(FaCalendarAlt, { className: "text-blue-500" })} Расписание на сегодня</div>
        <div className="divide-y">
          {mockSchedule.map(lesson => (
            <div key={lesson.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                {FaBook && React.createElement(FaBook, { className: "text-green-500" })}
                <span className="font-medium">{lesson.subject}</span>
                <span className="text-gray-500 text-sm">{lesson.room} каб.</span>
              </div>
              <span className="text-gray-700 font-semibold">{lesson.time}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Домашние задания */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="font-semibold text-lg mb-2 flex items-center gap-2">{FaClipboardCheck && React.createElement(FaClipboardCheck, { className: "text-purple-500" })} Домашние задания</div>
        <div className="divide-y">
          {mockHomework.map(hw => (
            <div key={hw.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                {FaBook && React.createElement(FaBook, { className: "text-green-500" })}
                <span className="font-medium">{hw.subject}</span>
                <span className="text-gray-500 text-sm">{hw.task}</span>
              </div>
              <span className="text-gray-700 font-semibold">до {hw.due}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Здесь могут быть другие виджеты для студента: успеваемость, активности и т.д. */}
    </div>
  );
};

export default StudentDashboard; 