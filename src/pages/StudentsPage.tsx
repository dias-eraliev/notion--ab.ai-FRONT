import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUserGraduate, FaPhone, FaEnvelope, FaIdCard } from 'react-icons/fa';

interface Student {
  id: string;
  fullName: string;
  class: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  parentName: string;
  parentPhone: string;
  photo: string;
}

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
  onViewDetails: (studentId: string) => void;
}

const StudentModal: React.FC<StudentModalProps> = ({ student, onClose, onViewDetails }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
                <img src={student.photo} alt={student.fullName} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{student.fullName}</h2>
                <p className="text-gray-600">Класс: {student.class}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Личная информация</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaIdCard className="w-5 h-5 text-gray-500 mr-3" />
                  <span>Дата рождения: {student.birthDate}</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="w-5 h-5 text-gray-500 mr-3" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="w-5 h-5 text-gray-500 mr-3" />
                  <span>{student.email}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Контакты родителей</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaUserGraduate className="w-5 h-5 text-gray-500 mr-3" />
                  <span>{student.parentName}</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="w-5 h-5 text-gray-500 mr-3" />
                  <span>{student.parentPhone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => onViewDetails(student.id)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Подробнее
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Временные данные для примера
  const students: Student[] = [
    {
      id: '1',
      fullName: 'Алихан Сатыбалды',
      class: '10A',
      birthDate: '2008-05-15',
      phone: '+7 (777) 123-45-67',
      email: 'alikhan@example.com',
      address: 'ул. Абая 123, кв. 45',
      parentName: 'Сатыбалды Нурлан',
      parentPhone: '+7 (777) 765-43-21',
      photo: `https://ui-avatars.com/api/?name=Алихан+Сатыбалды&background=random&size=200`
    },
    {
      id: '2',
      fullName: 'Айсулу Нурланова',
      class: '10B',
      birthDate: '2008-07-22',
      phone: '+7 (777) 234-56-78',
      email: 'aisulu@example.com',
      address: 'ул. Жандосова 456, кв. 12',
      parentName: 'Нурланова Айгуль',
      parentPhone: '+7 (777) 876-54-32',
      photo: `https://ui-avatars.com/api/?name=Айсулу+Нурланова&background=random&size=200`
    },
    {
      id: '3',
      fullName: 'Бауыржан Ахметов',
      class: '10A',
      birthDate: '2008-03-10',
      phone: '+7 (777) 345-67-89',
      email: 'bauyrzhan@example.com',
      address: 'ул. Тимирязева 789, кв. 34',
      parentName: 'Ахметов Серик',
      parentPhone: '+7 (777) 987-65-43',
      photo: `https://ui-avatars.com/api/?name=Бауыржан+Ахметов&background=random&size=200`
    },
    {
      id: '4',
      fullName: 'Динара Касымова',
      class: '10B',
      birthDate: '2008-09-05',
      phone: '+7 (777) 456-78-90',
      email: 'dinara@example.com',
      address: 'ул. Сатпаева 234, кв. 56',
      parentName: 'Касымова Гульнара',
      parentPhone: '+7 (777) 098-76-54',
      photo: `https://ui-avatars.com/api/?name=Динара+Касымова&background=random&size=200`
    },
    {
      id: '5',
      fullName: 'Ерлан Сериков',
      class: '10C',
      birthDate: '2008-11-15',
      phone: '+7 (777) 567-89-01',
      email: 'erlan@example.com',
      address: 'ул. Достык 567, кв. 78',
      parentName: 'Сериков Марат',
      parentPhone: '+7 (777) 109-87-65',
      photo: `https://ui-avatars.com/api/?name=Ерлан+Сериков&background=random&size=200`
    },
    {
      id: '6',
      fullName: 'Жанар Оспанова',
      class: '10A',
      birthDate: '2008-04-20',
      phone: '+7 (777) 678-90-12',
      email: 'zhanar@example.com',
      address: 'ул. Байтурсынова 123, кв. 45',
      parentName: 'Оспанова Айгуль',
      parentPhone: '+7 (777) 210-98-76',
      photo: `https://ui-avatars.com/api/?name=Жанар+Оспанова&background=random&size=200`
    },
    {
      id: '7',
      fullName: 'Арман Жумабаев',
      class: '10B',
      birthDate: '2008-06-25',
      phone: '+7 (777) 789-01-23',
      email: 'arman@example.com',
      address: 'ул. Толе би 456, кв. 89',
      parentName: 'Жумабаев Даулет',
      parentPhone: '+7 (777) 321-09-87',
      photo: `https://ui-avatars.com/api/?name=Арман+Жумабаев&background=random&size=200`
    },
    {
      id: '8',
      fullName: 'Мадина Сарсенова',
      class: '10C',
      birthDate: '2008-08-30',
      phone: '+7 (777) 890-12-34',
      email: 'madina@example.com',
      address: 'ул. Жарокова 789, кв. 12',
      parentName: 'Сарсенова Айнур',
      parentPhone: '+7 (777) 432-10-98',
      photo: `https://ui-avatars.com/api/?name=Мадина+Сарсенова&background=random&size=200`
    },
    {
      id: '9',
      fullName: 'Нурлан Тулегенов',
      class: '10A',
      birthDate: '2008-10-05',
      phone: '+7 (777) 901-23-45',
      email: 'nurlan@example.com',
      address: 'ул. Гагарина 234, кв. 56',
      parentName: 'Тулегенов Болат',
      parentPhone: '+7 (777) 543-21-09',
      photo: `https://ui-avatars.com/api/?name=Нурлан+Тулегенов&background=random&size=200`
    },
    {
      id: '10',
      fullName: 'Айгерим Бекмухамбетова',
      class: '10B',
      birthDate: '2008-12-10',
      phone: '+7 (777) 012-34-56',
      email: 'aigerim@example.com',
      address: 'ул. Розыбакиева 567, кв. 78',
      parentName: 'Бекмухамбетова Сауле',
      parentPhone: '+7 (777) 654-32-10',
      photo: `https://ui-avatars.com/api/?name=Айгерим+Бекмухамбетова&background=random&size=200`
    },
    {
      id: '11',
      fullName: 'Бекзат Муратов',
      class: '10C',
      birthDate: '2008-02-15',
      phone: '+7 (777) 123-45-67',
      email: 'bekzat@example.com',
      address: 'ул. Сейфуллина 890, кв. 23',
      parentName: 'Муратов Ержан',
      parentPhone: '+7 (777) 765-43-21',
      photo: `https://ui-avatars.com/api/?name=Бекзат+Муратов&background=random&size=200`
    },
    {
      id: '12',
      fullName: 'Гульназ Алимжанова',
      class: '10A',
      birthDate: '2008-04-20',
      phone: '+7 (777) 234-56-78',
      email: 'gulnaz@example.com',
      address: 'ул. Маметова 123, кв. 45',
      parentName: 'Алимжанова Ляззат',
      parentPhone: '+7 (777) 876-54-32',
      photo: `https://ui-avatars.com/api/?name=Гульназ+Алимжанова&background=random&size=200`
    },
    {
      id: '13',
      fullName: 'Дархан Сагынбаев',
      class: '10B',
      birthDate: '2008-06-25',
      phone: '+7 (777) 345-67-89',
      email: 'darkhan@example.com',
      address: 'ул. Кабанбай батыра 456, кв. 78',
      parentName: 'Сагынбаев Нурбол',
      parentPhone: '+7 (777) 987-65-43',
      photo: `https://ui-avatars.com/api/?name=Дархан+Сагынбаев&background=random&size=200`
    },
    {
      id: '14',
      fullName: 'Еркежан Нуржанова',
      class: '10C',
      birthDate: '2008-08-30',
      phone: '+7 (777) 456-78-90',
      email: 'yerkezhan@example.com',
      address: 'ул. Байзакова 789, кв. 12',
      parentName: 'Нуржанова Жанар',
      parentPhone: '+7 (777) 098-76-54',
      photo: `https://ui-avatars.com/api/?name=Еркежан+Нуржанова&background=random&size=200`
    },
    {
      id: '15',
      fullName: 'Жансая Абдрахманова',
      class: '10A',
      birthDate: '2008-10-05',
      phone: '+7 (777) 567-89-01',
      email: 'zhansaya@example.com',
      address: 'ул. Шевченко 234, кв. 56',
      parentName: 'Абдрахманова Айжан',
      parentPhone: '+7 (777) 109-87-65',
      photo: `https://ui-avatars.com/api/?name=Жансая+Абдрахманова&background=random&size=200`
    }
  ];

  const classes = Array.from(new Set(students.map(s => s.class))).sort();

  const filteredStudents = students.filter(student => {
    const matchesClass = !selectedClass || student.class === selectedClass;
    const matchesSearch = !searchQuery || 
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handleViewDetails = (studentId: string) => {
    navigate(`/students/${studentId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Студенты</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по имени..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="w-48">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Все классы</option>
              {classes.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedStudent(student)}
            >
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={student.photo}
                  alt={student.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{student.fullName}</h3>
                <p className="text-sm text-gray-600">Класс: {student.class}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <FaPhone className="w-4 h-4 mr-2" />
                  <span>{student.phone}</span>
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <FaEnvelope className="w-4 h-4 mr-2" />
                  <span>{student.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
};

export default StudentsPage; 