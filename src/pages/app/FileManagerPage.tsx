import React, { useState, useEffect } from 'react';
import {
  FaFolder,
  FaFile,
  FaFileAlt,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaSearch,
  FaThLarge,
  FaList,
  FaUpload,
  FaFolderPlus,
  FaEllipsisV,
  FaDownload,
  FaShare,
  FaStar,
  FaEdit,
  FaTrash,
  FaArrowLeft
} from 'react-icons/fa';

interface StorageInfo {
  total: number;
  used: number;
  categories: {
    documents: number;
    images: number;
    videos: number;
    audio: number;
    other: number;
  };
}

interface File {
  id: string;
  name: string;
  type: 'folder' | 'file';
  modified: string;
  size?: number;
  owner: {
    name: string;
    avatar: string;
  };
  shared: boolean;
  favorite: boolean;
}

const FileManagerPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [showContextMenu, setShowContextMenu] = useState<{
    x: number;
    y: number;
    itemId: string;
  } | null>(null);

  const storageInfo: StorageInfo = {
    total: 107374182400, // 100 GB
    used: 48318382080, // 45 GB
    categories: {
      documents: 16106127360, // 15 GB
      images: 12884901888, // 12 GB
      videos: 10737418240, // 10 GB
      audio: 5368709120, // 5 GB
      other: 3221225472, // 3 GB
    },
  };

  const files: File[] = [
    {
      id: '1',
      name: 'Учебные материалы',
      type: 'folder',
      modified: '2024-01-15T10:00:00',
      owner: {
        name: 'Администратор',
        avatar: '/avatars/admin.jpg'
      },
      shared: true,
      favorite: true
    },
    {
      id: '2',
      name: 'Документация',
      type: 'folder',
      modified: '2024-01-14T15:30:00',
      owner: {
        name: 'Администратор',
        avatar: '/avatars/admin.jpg'
      },
      shared: true,
      favorite: false
    },
    {
      id: '3',
      name: 'Медиа файлы',
      type: 'folder',
      modified: '2024-01-13T09:45:00',
      owner: {
        name: 'Администратор',
        avatar: '/avatars/admin.jpg'
      },
      shared: false,
      favorite: false
    }
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'folder') return <FaFolder className="text-corporate-primary" />;
    // Добавьте другие иконки для разных типов файлов
    return <FaFile className="text-gray-400" />;
  };

  const handleItemClick = (file: File) => {
    if (file.type === 'folder') {
      setCurrentPath([...currentPath, file.name]);
    }
    // Добавьте обработку для файлов
  };

  const handleBackClick = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Боковая панель */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Хранилище</h2>
          <div className="space-y-2">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-corporate-primary"
                style={{ width: `${(storageInfo.used / storageInfo.total) * 100}%` }}
              />
            </div>
            <div className="text-sm text-gray-500">
              {formatFileSize(storageInfo.used)} из {formatFileSize(storageInfo.total)} использовано
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-corporate-primary font-medium">
            Избранное
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
            Общий доступ
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
            Корзина
          </button>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Верхняя панель */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {currentPath.length > 0 && (
                <button
                  onClick={handleBackClick}
                  className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FaArrowLeft />
                </button>
              )}
              <h1 className="text-2xl font-semibold text-corporate-primary">
                {currentPath.length === 0 ? 'Файлы' : currentPath[currentPath.length - 1]}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск файлов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-corporate-primary"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-corporate-primary shadow-sm'
                      : 'text-gray-500 hover:text-corporate-primary'
                  }`}
                >
                  <FaThLarge />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-corporate-primary shadow-sm'
                      : 'text-gray-500 hover:text-corporate-primary'
                  }`}
                >
                  <FaList />
                </button>
              </div>
              <button className="flex items-center px-4 py-2 bg-corporate-primary text-white rounded-lg hover:bg-corporate-primary/90 transition-colors">
                <FaUpload className="mr-2" />
                Загрузить
              </button>
              <button className="flex items-center px-4 py-2 border border-corporate-primary text-corporate-primary rounded-lg hover:bg-corporate-primary/10 transition-colors">
                <FaFolderPlus className="mr-2" />
                Новая папка
              </button>
            </div>
          </div>

          {/* Путь */}
          <div className="flex items-center text-sm text-gray-500">
            <button 
              onClick={() => setCurrentPath([])}
              className="hover:text-corporate-primary transition-colors"
            >
              Главная
            </button>
            {currentPath.map((folder, index) => (
              <React.Fragment key={folder}>
                <span className="mx-2">/</span>
                <button
                  onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                  className="hover:text-corporate-primary transition-colors"
                >
                  {folder}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Основная область */}
        <div className="flex-1 p-4 overflow-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleItemClick(file)}
                  className="group bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl">{getFileIcon(file)}</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowContextMenu({
                          x: e.clientX,
                          y: e.clientY,
                          itemId: file.id
                        });
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaEllipsisV />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-gray-900 truncate" title={file.name}>
                      {file.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(file.modified).toLocaleDateString('ru')}</span>
                      {file.size && <span>{formatFileSize(file.size)}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Название</th>
                    <th className="px-6 py-3">Владелец</th>
                    <th className="px-6 py-3">Изменен</th>
                    <th className="px-6 py-3">Размер</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.map((file) => (
                    <tr
                      key={file.id}
                      onClick={() => handleItemClick(file)}
                      className="hover:bg-gray-50 cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{getFileIcon(file)}</span>
                          <span className="font-medium text-gray-900">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {file.owner.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(file.modified).toLocaleDateString('ru')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {file.size ? formatFileSize(file.size) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowContextMenu({
                              x: e.clientX,
                              y: e.clientY,
                              itemId: file.id
                            });
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaEllipsisV />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Контекстное меню */}
      {showContextMenu && (
        <>
          <div
            className="fixed inset-0"
            onClick={() => setShowContextMenu(null)}
          />
          <div
            className="fixed bg-white rounded-lg shadow-lg py-2 w-48"
            style={{
              top: showContextMenu.y,
              left: showContextMenu.x,
              zIndex: 50
            }}
          >
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
              <FaDownload className="mr-3 text-gray-400" />
              Скачать
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
              <FaShare className="mr-3 text-gray-400" />
              Поделиться
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
              <FaStar className="mr-3 text-gray-400" />
              Добавить в избранное
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
              <FaEdit className="mr-3 text-gray-400" />
              Переименовать
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center">
              <FaTrash className="mr-3" />
              Удалить
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FileManagerPage; 