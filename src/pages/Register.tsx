import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import { useNavigate } from 'react-router-dom';

const roles = [
  { value: 'ADMIN', label: 'Админ' },
  { value: 'TEACHER', label: 'Учитель' },
  { value: 'STUDENT', label: 'Ученик' },
  { value: 'PARENT', label: 'Родитель' },
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
    email: '',
    password: '',
    role: '',
    position: '',
    subject: '',
    className: '',
    child: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    // Имитация запроса
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }, 2000);
  };

  // Анимация для букв логотипа
  const letterVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 50,
        damping: 10
      }
    })
  };
  const letters = "Fizmat.AI".split("");

  return (
    <div className="min-h-screen bg-corporate-bg flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      <div className="w-full max-w-md relative z-10">
        {/* Логотип */}
        <div className="flex justify-center mb-8 space-x-1">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="text-6xl font-bold text-corporate-primary"
            >
              {letter}
            </motion.span>
          ))}
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-notion p-8 relative"
        >
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-xl z-20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="bg-green-500 text-white rounded-full p-4"
                >
                  <svg width="32" height="32" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <h2 className="text-2xl font-semibold text-center mb-2 text-corporate-primary">Регистрация</h2>
          <p className="text-gray-600 text-center mb-8">Создайте свою учетную запись</p>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Имя</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} required className="block w-full px-3 py-2 border border-corporate-primary/20 rounded-lg focus:ring-2 focus:ring-corporate-primary focus:border-corporate-primary bg-white/50" placeholder="Имя" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Фамилия</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} required className="block w-full px-3 py-2 border border-corporate-primary/20 rounded-lg focus:ring-2 focus:ring-corporate-primary focus:border-corporate-primary bg-white/50" placeholder="Фамилия" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Отчество</label>
              <input name="middleName" value={form.middleName} onChange={handleChange} className="block w-full px-3 py-2 border border-corporate-primary/20 rounded-lg focus:ring-2 focus:ring-corporate-primary focus:border-corporate-primary bg-white/50" placeholder="Отчество (необязательно)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Телефон</label>
              <input name="phone" value={form.phone} onChange={handleChange} required className="block w-full px-3 py-2 border border-corporate-primary/20 rounded-lg focus:ring-2 focus:ring-corporate-primary focus:border-corporate-primary bg-white/50" placeholder="+7 (___) ___-__-__" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="block w-full px-3 py-2 border border-corporate-primary/20 rounded-lg focus:ring-2 focus:ring-corporate-primary focus:border-corporate-primary bg-white/50" placeholder="Email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Пароль</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required className="block w-full px-3 py-2 border border-corporate-primary/20 rounded-lg focus:ring-2 focus:ring-corporate-primary focus:border-corporate-primary bg-white/50" placeholder="Пароль" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Роль</label>
              <select name="role" value={form.role} onChange={handleChange} required className="block w-full px-3 py-2 border border-corporate-primary/20 rounded-lg focus:ring-2 focus:ring-corporate-primary focus:border-corporate-primary bg-white/50">
                <option value="" disabled>Выберите роль</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>
            {/* Динамические поля по роли */}
            {form.role === 'ADMIN' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Должность</label>
                <input name="position" value={form.position} onChange={handleChange} required className="block w-full px-3 py-2 border border-corporate-primary/20 rounded-lg focus:ring-2 focus:ring-corporate-primary focus:border-corporate-primary bg-white/50" placeholder="Должность" />
              </div>
            )}
            {form.role === 'TEACHER' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Предмет</label>
                <input name="subject" value={form.subject} onChange={handleChange} required className="block w-full px-3 py-2 border border-corporate-primary/20 rounded-lg focus:ring-2 focus:ring-corporate-primary focus:border-corporate-primary bg-white/50" placeholder="Предмет" />
              </div>
            )}
            {form.role === 'STUDENT' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Класс</label>
                <input name="className" value={form.className} onChange={handleChange} required className="block w-full px-3 py-2 border border-corporate-primary/20 rounded-lg focus:ring-2 focus:ring-corporate-primary focus:border-corporate-primary bg-white/50" placeholder="Класс (например, 10A)" />
              </div>
            )}
            {form.role === 'PARENT' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Ученик</label>
                <input name="child" value={form.child} onChange={handleChange} required className="block w-full px-3 py-2 border border-corporate-primary/20 rounded-lg focus:ring-2 focus:ring-corporate-primary focus:border-corporate-primary bg-white/50" placeholder="ФИО ученика" />
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-corporate-primary hover:bg-corporate-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corporate-primary transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                'Зарегистрироваться'
              )}
            </motion.button>
          </form>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-center text-sm text-corporate-primary/70"
        >
          Copyright © 2025 - Fizmat.AI
          <br />
          <span className="text-xs text-gray-400">powered by AB.AI</span>
        </motion.p>
      </div>
    </div>
  );
};

export default Register; 