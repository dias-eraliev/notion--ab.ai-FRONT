import React, { useState } from 'react';
import { FaSearch, FaDownload, FaEllipsisV, FaPlus, FaTimes, FaEnvelope, FaPhone, FaGraduationCap, FaCalendarAlt, FaIdCard, FaMapMarkerAlt } from 'react-icons/fa';

interface Employee {
  id: number;
  name: string;
  iin: string;
  email: string;
  position: string;
  category: string;
  department: string;
  experience: string;
  status: 'active' | 'vacation' | 'sick' | 'business_trip';
  phone?: string;
  education?: string;
  specialization?: string;
  address?: string;
  hireDate?: string;
  subjects?: string[];
  achievements?: string[];
  documents?: Array<{
    id: string;
    type: string;
    number: string;
    date: string;
    name: string;
    status: 'active' | 'expired';
  }>;
}

const employees: Employee[] = [
  {
    id: 1,
    name: 'Сатпаев Арман Болатович',
    iin: '880501300999',
    email: 'satpayev@school.edu.kz',
    position: 'Учитель математики',
    category: 'Высшая категория',
    department: 'Кафедра математики',
    experience: '12 лет',
    status: 'active',
    phone: '+7 (777) 123-45-67',
    education: 'КазНУ им. аль-Фараби, факультет механики и математики',
    specialization: 'Математика и информатика',
    address: 'г. Астана, ул. Кабанбай батыра 53',
    hireDate: '01.09.2012',
    subjects: ['Алгебра', 'Геометрия', 'Математический анализ'],
    achievements: [
      'Победитель республиканского конкурса "Учитель года - 2022"',
      'Автор методических пособий по подготовке к ЕНТ',
      'Руководитель школьного математического кружка'
    ],
    documents: [
      {
        id: 'doc1',
        type: 'Приказ',
        number: '123-П',
        date: '01.09.2012',
        name: 'Приказ о назначении на должность',
        status: 'active'
      },
      {
        id: 'doc2',
        type: 'Сертификат',
        number: 'NK-2023-123',
        date: '15.03.2023',
        name: 'Сертификат о повышении квалификации "Современные методы преподавания математики"',
        status: 'active'
      },
      {
        id: 'doc3',
        type: 'Диплом',
        number: 'ЖБ-123456',
        date: '15.06.2010',
        name: 'Диплом о высшем образовании',
        status: 'active'
      }
    ]
  },
  {
    id: 2,
    name: 'Алимова Динара Нурлановна',
    iin: '900712400777',
    email: 'alimova@school.edu.kz',
    position: 'Учитель русского языка',
    category: 'Первая категория',
    department: 'Кафедра филологии',
    experience: '8 лет',
    status: 'vacation'
  },
  {
    id: 3,
    name: 'Байтуров Нурлан Серикович',
    iin: '850304500888',
    email: 'baiturov@school.edu.kz',
    position: 'Учитель физики',
    category: 'Высшая категория',
    department: 'Кафедра естественных наук',
    experience: '15 лет',
    status: 'active'
  },
  {
    id: 4,
    name: 'Нурпеисова Айгуль Маратовна',
    iin: '920825600555',
    email: 'nurpeisova@school.edu.kz',
    position: 'Учитель английского языка',
    category: 'Первая категория',
    department: 'Кафедра иностранных языков',
    experience: '6 лет',
    status: 'active'
  },
  {
    id: 5,
    name: 'Жумабаев Даулет Ерланович',
    iin: '891130200333',
    email: 'zhumabaev@school.edu.kz',
    position: 'Учитель информатики',
    category: 'Высшая категория',
    department: 'Кафедра информатики',
    experience: '7 лет',
    status: 'business_trip'
  }
];

const EmployeesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Все кафедры');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'vacation':
        return 'bg-blue-100 text-blue-800';
      case 'sick':
        return 'bg-red-100 text-red-800';
      case 'business_trip':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'vacation':
        return 'Отпуск';
      case 'sick':
        return 'Больничный';
      case 'business_trip':
        return 'Командировка';
      default:
        return status;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Сотрудники и преподаватели</h1>
          <p className="text-sm text-gray-500">Управление кадровым составом образовательного учреждения</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <FaDownload className="w-4 h-4" />
            Экспорт
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
            <FaPlus className="w-4 h-4" />
            Добавить сотрудника
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по сотрудникам..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md bg-white"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option>Все кафедры</option>
          <option>Кафедра математики</option>
          <option>Кафедра филологии</option>
          <option>Кафедра естественных наук</option>
          <option>Кафедра иностранных языков</option>
          <option>Кафедра информатики</option>
        </select>
        <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          По фамилии
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сотрудник
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Должность
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Кафедра
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Стаж
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 bg-gray-50"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr 
                key={employee.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedEmployee(employee)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.position}</div>
                  <div className="text-sm text-gray-500">{employee.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.experience}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                    {getStatusText(employee.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    className="text-gray-400 hover:text-gray-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEmployee(employee);
                    }}
                  >
                    <FaEllipsisV className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Заголовок */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xl font-medium">
                      {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-gray-900">{selectedEmployee.name}</h2>
                      <span className="text-sm text-gray-500">ИИН: {selectedEmployee.iin}</span>
                    </div>
                    <p className="text-gray-600">{selectedEmployee.position}</p>
                    <span className={`mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedEmployee.status)}`}>
                      {getStatusText(selectedEmployee.status)}
                    </span>
                  </div>
                </div>
                <button 
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setSelectedEmployee(null)}
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              {/* Основная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Контактная информация</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaEnvelope className="w-5 h-5 text-gray-400 mr-3" />
                      <span>{selectedEmployee.email}</span>
                    </div>
                    {selectedEmployee.phone && (
                      <div className="flex items-center">
                        <FaPhone className="w-5 h-5 text-gray-400 mr-3" />
                        <span>{selectedEmployee.phone}</span>
                      </div>
                    )}
                    {selectedEmployee.address && (
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="w-5 h-5 text-gray-400 mr-3" />
                        <span>{selectedEmployee.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Профессиональная информация</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaGraduationCap className="w-5 h-5 text-gray-400 mr-3" />
                      <span>{selectedEmployee.education}</span>
                    </div>
                    <div className="flex items-center">
                      <FaIdCard className="w-5 h-5 text-gray-400 mr-3" />
                      <span>{selectedEmployee.specialization}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="w-5 h-5 text-gray-400 mr-3" />
                      <span>Дата приема: {selectedEmployee.hireDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Предметы */}
              {selectedEmployee.subjects && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Преподаваемые предметы</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployee.subjects.map((subject, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Достижения */}
              {selectedEmployee.achievements && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Достижения</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {selectedEmployee.achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-700">{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Документы */}
              {selectedEmployee.documents && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Документы</h3>
                  <div className="space-y-3">
                    {selectedEmployee.documents.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-gray-900">{doc.name}</div>
                          <div className="text-sm text-gray-500">
                            {doc.type} №{doc.number} от {doc.date}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            doc.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {doc.status === 'active' ? 'Действующий' : 'Истёк'}
                          </span>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <FaDownload className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Кнопки действий */}
              <div className="flex justify-between pt-4 border-t">
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Редактировать
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                    Скачать личное дело
                  </button>
                </div>
                <button className="px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100">
                  Деактивировать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage; 