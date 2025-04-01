import React, { useState } from 'react';
import {
  FaInbox,
  FaPaperPlane,
  FaRegStar,
  FaTrash,
  FaDraft2Digital,
  FaShieldAlt,
  FaSearch,
  FaFilter,
  FaStar,
  FaReply,
  FaReplyAll,
  FaForward,
  FaArchive,
  FaPlus,
  FaPaperclip,
  FaTimes
} from 'react-icons/fa';

interface Email {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: string[];
  subject: string;
  body: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam';
}

const EmailPage: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<Email['folder']>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  // Демо-данные
  const emails: Email[] = [
    {
      id: '1',
      from: {
        name: 'Иван Петров',
        email: 'ivan@school.edu',
        avatar: 'https://ui-avatars.com/api/?name=Иван+Петров&background=random'
      },
      to: ['me@school.edu'],
      subject: 'План на следующую неделю',
      body: 'Добрый день! Прошу ознакомиться с планом работы на следующую неделю...',
      date: '14:30',
      isRead: false,
      isStarred: true,
      folder: 'inbox',
      attachments: [
        {
          name: 'plan.pdf',
          size: '2.5 MB',
          type: 'application/pdf'
        }
      ]
    },
    {
      id: '2',
      from: {
        name: 'Мария Иванова',
        email: 'maria@school.edu',
        avatar: 'https://ui-avatars.com/api/?name=Мария+Иванова&background=random'
      },
      to: ['me@school.edu'],
      subject: 'Отчет по успеваемости',
      body: 'Во вложении отправляю отчет по успеваемости за текущий месяц...',
      date: '12:15',
      isRead: true,
      isStarred: false,
      folder: 'inbox'
    }
  ];

  const folders = [
    { id: 'inbox', name: 'Входящие', icon: FaInbox },
    { id: 'sent', name: 'Отправленные', icon: FaPaperPlane },
    { id: 'drafts', name: 'Черновики', icon: FaDraft2Digital },
    { id: 'starred', name: 'Помеченные', icon: FaRegStar },
    { id: 'trash', name: 'Корзина', icon: FaTrash },
    { id: 'spam', name: 'Спам', icon: FaShieldAlt }
  ];

  const filteredEmails = emails.filter(
    (email) =>
      email.folder === selectedFolder &&
      (searchQuery
        ? email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.from.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true)
  );

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Левая панель - папки */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4">
          <button
            onClick={() => setShowCompose(true)}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="mr-2" />
            Написать
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id as Email['folder'])}
              className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 ${
                selectedFolder === folder.id ? 'bg-blue-50 text-blue-500' : 'text-gray-700'
              }`}
            >
              <folder.icon className="mr-3" />
              <span>{folder.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Средняя панель - список писем */}
      <div className="w-96 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск писем..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {folders.find((f) => f.id === selectedFolder)?.name}
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-50 text-blue-500' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FaFilter />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`flex p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                selectedEmail?.id === email.id ? 'bg-blue-50' : ''
              } ${!email.isRead ? 'font-semibold' : ''}`}
            >
              <img
                src={email.from.avatar}
                alt={email.from.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{email.from.name}</span>
                  <span className="text-xs text-gray-500">{email.date}</span>
                </div>
                <h3 className="text-sm text-gray-900 truncate">{email.subject}</h3>
                <p className="text-xs text-gray-500 truncate">{email.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Правая панель - содержимое письма */}
      <div className="flex-1 bg-white flex flex-col">
        {selectedEmail ? (
          <>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {selectedEmail.subject}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setSelectedEmail({
                        ...selectedEmail,
                        isStarred: !selectedEmail.isStarred
                      })
                    }
                    className={`p-2 rounded-lg transition-colors ${
                      selectedEmail.isStarred
                        ? 'text-yellow-500'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {selectedEmail.isStarred ? <FaStar /> : <FaRegStar />}
                  </button>
                  <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                    <FaReply />
                  </button>
                  <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                    <FaReplyAll />
                  </button>
                  <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                    <FaForward />
                  </button>
                  <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                    <FaArchive />
                  </button>
                  <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={selectedEmail.from.avatar}
                    alt={selectedEmail.from.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">
                        {selectedEmail.from.name}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        &lt;{selectedEmail.from.email}&gt;
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Кому: {selectedEmail.to.join(', ')}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{selectedEmail.date}</span>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="prose max-w-none">{selectedEmail.body}</div>
              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Вложения ({selectedEmail.attachments.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedEmail.attachments.map((attachment) => (
                      <div
                        key={attachment.name}
                        className="flex items-center p-3 border border-gray-200 rounded-lg"
                      >
                        <FaPaperclip className="text-gray-400 mr-3" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {attachment.name}
                          </div>
                          <div className="text-xs text-gray-500">{attachment.size}</div>
                        </div>
                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          Скачать
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Выберите письмо для просмотра
          </div>
        )}
      </div>

      {/* Модальное окно создания письма */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Новое письмо</h2>
              <button
                onClick={() => setShowCompose(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Кому"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Тема"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <textarea
                  placeholder="Текст письма"
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
                  <FaPaperclip />
                </button>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Отмена
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Отправить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailPage; 