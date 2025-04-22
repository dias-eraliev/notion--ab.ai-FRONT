import React from 'react';
import { FaBuilding, FaRegDotCircle, FaRegClock, FaUserTie, FaThLarge, FaFileAlt, FaMapMarker } from 'react-icons/fa';

const cardClass =
  'bg-white shadow-md rounded-xl p-6 mb-6 transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg animate-fadein';

const AboutPage: React.FC = () => (
  <div className="max-w-3xl mx-auto px-2 py-8">
    <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
      <FaBuilding className="text-blue-600 w-8 h-8" /> Информация об организации
    </h1>
    <div className={cardClass} style={{animationDelay: '0.1s'}}>
      <div className="mb-2"><b>Полное название:</b><br />Некоммерческое акционерное общество «Республиканская физико-математическая школа»</div>
      <div className="mb-2"><b>Тип учреждения:</b><br />Специализированная средняя школа с углублённым изучением физики, математики и программирования</div>
      <div className="mb-2"><b>Год основания:</b> 16 октября 1972 года</div>
      <div className="mb-2"><b>Форма собственности:</b> Государственная</div>
      <div className="mb-2"><b>ИНН/БИН:</b> 190441024985</div>
      <div className="mb-2"><b>Количество учащихся:</b> Более 1000 учеников</div>
      <div><b>Количество сотрудников:</b> Более 100 преподавателей и административного персонала</div>
    </div>
    <div className={cardClass} style={{animationDelay: '0.2s'}}>
      <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><FaRegDotCircle className="text-blue-600 w-6 h-6" /> Миссия и философия</h2>
      <blockquote className="bg-gray-50 p-4 rounded-lg italic border-l-4 border-blue-400">«РФМШ Алматы — это школа будущего, где талантливые ученики растут в среде науки, уважения и амбиций.»</blockquote>
    </div>
    <div className={cardClass} style={{animationDelay: '0.3s'}}>
      <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><FaRegClock className="text-blue-600 w-6 h-6" /> История и достижения</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><b>1972:</b> Основание школы в Алматы по инициативе академика О. Жаутыкова</li>
        <li><b>2015:</b> Преобразование в Некоммерческое акционерное общество</li>
        <li><b>2024:</b> Ученики завоевали 563 медали на международных олимпиадах, включая 77 золотых</li>
      </ul>
    </div>
    <div className={cardClass} style={{animationDelay: '0.4s'}}>
      <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><FaUserTie className="text-blue-600 w-6 h-6" /> Администрация</h2>
      <div className="mb-2"><b>Директор:</b><br />[ФИО Директора]<br />📧 [Электронная почта]</div>
      <div><b>Заместители директора:</b><br />[ФИО Заместителя 1] <br />📧 [Электронная почта]<br />[ФИО Заместителя 2] <br />📧 [Электронная почта]</div>
    </div>
    <div className={cardClass} style={{animationDelay: '0.5s'}}>
      <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><FaThLarge className="text-blue-600 w-6 h-6" /> Инфраструктура</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>42 учебных кабинета</li>
        <li>3 лаборатории</li>
        <li>2 спортзала</li>
        <li>1 астрономическая обсерватория</li>
      </ul>
    </div>
    <div className={cardClass} style={{animationDelay: '0.6s'}}>
      <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><FaFileAlt className="text-blue-600 w-6 h-6" /> Нормативные документы</h2>
      <table className="w-full bg-gray-50 rounded-lg overflow-hidden">
        <thead>
          <tr className="text-left">
            <th className="p-2">Документ</th>
            <th className="p-2">Дата</th>
            <th className="p-2">Скачать</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2">Устав</td>
            <td className="p-2">2020</td>
            <td className="p-2"><span role="img" aria-label="download">📥</span></td>
          </tr>
          <tr>
            <td className="p-2">Свидетельство о гос. регистрации</td>
            <td className="p-2">2018</td>
            <td className="p-2"><span role="img" aria-label="download">📥</span></td>
          </tr>
          <tr>
            <td className="p-2">Лицензия на образовательную деятельность</td>
            <td className="p-2">2022</td>
            <td className="p-2"><span role="img" aria-label="download">📥</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className={cardClass} style={{animationDelay: '0.7s'}}>
      <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><FaMapMarker className="text-blue-600 w-6 h-6" /> Контактная информация</h2>
      <div className="mb-2"><b>Адрес:</b><br />г. Алматы, Бостандыкский район, бульвар Бухар Жырау, 36, индекс 050040</div>
      <div className="mb-2"><b>Телефон:</b><br />+7 (727) 395-01-83</div>
      <div className="mb-2"><b>Электронная почта:</b><br />reception@fizmat.kz</div>
      <div><b>Официальный сайт:</b><br /><a href="https://almaty.fizmat.kz" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://almaty.fizmat.kz</a></div>
    </div>
    <style>{`
      @keyframes fadein { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
      .animate-fadein { animation: fadein 0.7s cubic-bezier(.4,0,.2,1) both; }
    `}</style>
  </div>
);

export default AboutPage; 