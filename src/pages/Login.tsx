import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaCheck } from 'react-icons/fa';
import AnimatedBackground from '../components/AnimatedBackground';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
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

  // Анимация для формы
  const formVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.8,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const letters = "FIZMAT.AI".split("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Имитация запроса
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        // Здесь будет редирект на главную страницу
      }, 1500);
    }, 2000);
  };

  const handleGoogleLogin = () => {
    // Здесь будет логика входа через Google
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-[#1e40af] bg-gradient-to-br from-[#1e40af] to-[#3b82f6] flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="w-full max-w-md relative z-10">
        {/* Анимированный логотип */}
        <div className="flex justify-center mb-8 space-x-1">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className={`text-6xl font-bold ${letter === '.' ? 'text-white' : 'text-white'}`}
            >
              {letter}
            </motion.span>
          ))}
        </div>
        
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 relative"
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
                  className="bg-[#1e40af] text-white rounded-full p-4"
                >
                  <FaCheck className="w-8 h-8" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <h2 className="text-2xl font-semibold text-center mb-2 text-[#1e40af]">Добро пожаловать</h2>
          <p className="text-gray-600 text-center mb-8">Войдите в свою учетную запись, чтобы продолжить</p>
          
          {/* Кнопка входа через Google */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center py-2 px-4 mb-6 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e40af]"
          >
            <FaGoogle className="w-5 h-5 mr-2 text-[#1e40af]" />
            Войти через Google
          </motion.button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">или</span>
            </div>
          </div>
          
          {/* Форма входа */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Имя пользователя
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-[#1e40af]/60" />
                </div>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  className="block w-full pl-10 pr-3 py-2 border border-[#1e40af]/20 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] bg-white/50 transition-all duration-200 ease-in-out hover:shadow-lg"
                  placeholder="Введите email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-[#1e40af]/60" />
                </div>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type={showPassword ? "text" : "password"}
                  className="block w-full pl-10 pr-10 py-2 border border-[#1e40af]/20 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] bg-white/50 transition-all duration-200 ease-in-out hover:shadow-lg"
                  placeholder="Введите пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-[#1e40af]/60" />
                  ) : (
                    <FaEye className="h-5 w-5 text-[#1e40af]/60" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-[#1e40af] focus:ring-[#1e40af] border-[#1e40af]/20 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Запомнить меня
                </label>
              </div>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="text-sm font-medium text-[#1e40af] hover:text-[#1e40af]/80"
              >
                Забыли пароль?
              </motion.a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1e40af] hover:bg-[#1e40af]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e40af] transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                'Войти'
              )}
            </motion.button>
          </form>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-center text-sm text-white/70"
        >
          Copyright © 2024 - FIZMAT.AI
        </motion.p>
      </div>
    </div>
  );
};

export default Login; 