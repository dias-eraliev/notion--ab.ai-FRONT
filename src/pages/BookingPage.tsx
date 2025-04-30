import React, { useState } from 'react';
import { FaCalendarAlt, FaUser, FaClock, FaCheck, FaTimes, FaBullseye, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BookingPage: React.FC = () => {
  const [formData, setFormData] = useState({
    room: '',
    date: '',
    timeStart: '',
    timeEnd: '',
    responsible: '',
    purpose: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      alert('Бронь отправлена на согласование!');
    }, 1000);
  };

  return (
    <div className="p-6 max-w-[800px] mx-auto">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Бронирование аудиторий</h1>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Аудитория</label>
            <select
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Выберите аудиторию</option>
              <option value="301">301 - Лекционный зал</option>
              <option value="405">405 - IT-класс</option>
              <option value="201">201 - Химическая лаборатория</option>
              <option value="302">302 - Конференц-зал</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Время начала</label>
              <input
                type="time"
                value={formData.timeStart}
                onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Время окончания</label>
              <input
                type="time"
                value={formData.timeEnd}
                onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ответственный</label>
            <input
              type="text"
              placeholder="ФИО ответственного"
              value={formData.responsible}
              onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Цель бронирования</label>
            <textarea
              placeholder="Опишите цель бронирования"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              rows={3}
              required
            ></textarea>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setFormData({ room: '', date: '', timeStart: '', timeEnd: '', responsible: '', purpose: '' })}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md border border-gray-300"
            >
              <FaTimes className="mr-2" /> Очистить
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <FaCheck className="mr-2" /> Забронировать
            </button>
          </div>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center"
        >
          <FaCheckCircle className="text-green-600 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Успешно забронировано!</h2>
          <p className="text-gray-700 mb-6">Ваша заявка отправлена на согласование.</p>
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
                  1
                </div>
                <span className="text-sm text-gray-700 mt-2">Заявка</span>
              </div>
              <div className="h-1 w-10 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full">
                  2
                </div>
                <span className="text-sm text-gray-700 mt-2">Департамент помещений</span>
              </div>
              <div className="h-1 w-10 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full">
                  3
                </div>
                <span className="text-sm text-gray-700 mt-2">Директор</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BookingPage;