import React, { useState } from 'react';
import {
  FaFolder,
  FaFolderOpen,
  FaFile,
  FaFileAlt,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
  FaFileVideo,
  FaFileAudio,
  FaFileCode,
  FaPlus,
  FaUpload,
  FaDownload,
  FaTrash,
  FaPencilAlt,
  FaCopy,
  FaCut,
  FaPaste,
  FaSearch,
  FaList,
  FaTh,
  FaSort,
  FaChevronRight,
  FaChevronDown,
  FaTimes,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: string;
  path: string;
  extension?: string;
  children?: FileItem[];
}

const FilesPage: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Документы',
      type: 'folder',
      modified: '2024-03-10T10:00',
      path: '/documents',
      children: [
        {
          id: '2',
          name: 'Отчет.docx',
          type: 'file',
          size: 1024576,
          modified: '2024-03-10T09:30',
          path: '/documents/report.docx',
          extension: 'docx'
        }
      ]
    },
    {
      id: '3',
      name: 'Изображения',
      type: 'folder',
      modified: '2024-03-09T15:20',
      path: '/images',
      children: [
        {
          id: '4',
          name: 'фото.jpg',
          type: 'file',
          size: 2048576,
          modified: '2024-03-09T15:15',
          path: '/images/photo.jpg',
          extension: 'jpg'
        }
      ]
    }
  ]);

  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [clipboard, setClipboard] = useState<{ items: string[]; action: 'copy' | 'cut' } | null>(null);
  const [showNewItemDialog, setShowNewItemDialog] = useState(false);
  const [newItemType, setNewItemType] = useState<'file' | 'folder'>('folder');

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return file.children && selectedItems.includes(file.id) ? (
        <FaFolderOpen className="text-yellow-500" />
      ) : (
        <FaFolder className="text-yellow-500" />
      );
    }

    switch (file.extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint className="text-orange-500" />;
      case 'zip':
      case 'rar':
      case '7z':
        return <FaFileArchive className="text-purple-500" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <FaFileVideo className="text-pink-500" />;
      case 'mp3':
      case 'wav':
        return <FaFileAudio className="text-blue-400" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FaFileImage className="text-green-400" />;
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'html':
      case 'css':
        return <FaFileCode className="text-gray-500" />;
      default:
        return <FaFileAlt className="text-gray-400" />;
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const getCurrentFiles = (): FileItem[] => {
    let currentFiles: FileItem[] = [...files];
    
    // Фильтрация по текущему пути
    if (currentPath !== '/') {
      const pathParts = currentPath.split('/').filter(Boolean);
      currentFiles = currentFiles.filter((file: FileItem) => {
        const filePathParts = file.path.split('/').filter(Boolean);
        return pathParts.every((part: string, index: number) => filePathParts[index] === part);
      });
    }
    
    // Фильтрация по поиску
    if (searchQuery) {
      currentFiles = currentFiles.filter((file: FileItem) => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Сортировка
    currentFiles.sort((a: FileItem, b: FileItem) => {
      const aValue = a[sortBy as keyof FileItem];
      const bValue = b[sortBy as keyof FileItem];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return currentFiles;
  };

  const handleItemClick = (item: FileItem, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      setSelectedItems((prev) =>
        prev.includes(item.id)
          ? prev.filter((id) => id !== item.id)
          : [...prev, item.id]
      );
    } else if (event.shiftKey && selectedItems.length > 0) {
      const currentFiles = getCurrentFiles();
      const lastSelectedIndex = currentFiles.findIndex(
        (file) => file.id === selectedItems[selectedItems.length - 1]
      );
      const clickedIndex = currentFiles.findIndex(
        (file) => file.id === item.id
      );
      const start = Math.min(lastSelectedIndex, clickedIndex);
      const end = Math.max(lastSelectedIndex, clickedIndex);
      const newSelection = currentFiles
        .slice(start, end + 1)
        .map((file) => file.id);
      setSelectedItems((prev) => [...new Set([...prev, ...newSelection])]);
    } else {
      if (item.type === 'folder') {
        setCurrentPath((prev) => [...prev, item.id]);
        setSelectedItems([]);
      } else {
        setSelectedItems([item.id]);
      }
    }
  };

  const handleSort = (field: 'name' | 'modified' | 'size') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      {/* Верхняя панель */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPath([])}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Корневая папка
            </button>
            {currentPath.map((pathId, index) => (
              <React.Fragment key={pathId}>
                <FaChevronRight className="text-gray-400" />
                <button
                  onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {
                    files
                      .find((f) => f.id === pathId)
                      ?.name
                  }
                </button>
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск файлов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {viewMode === 'list' ? <FaList /> : <FaTh />}
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNewItemDialog(true)}
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="mr-2" />
            Создать
          </button>
          <button
            onClick={() => {/* Реализовать загрузку файлов */}}
            className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaUpload className="mr-2" />
            Загрузить
          </button>
          {selectedItems.length > 0 && (
            <>
              <button
                onClick={() => {/* Реализовать скачивание */}}
                className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaDownload className="mr-2" />
                Скачать
              </button>
              <button
                onClick={() => {/* Реализовать копирование */}}
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaCopy className="mr-2" />
                Копировать
              </button>
              <button
                onClick={() => {/* Реализовать вырезание */}}
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaCut className="mr-2" />
                Вырезать
              </button>
              <button
                onClick={() => {/* Реализовать переименование */}}
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaPencilAlt className="mr-2" />
                Переименовать
              </button>
              <button
                onClick={() => {/* Реализовать удаление */}}
                className="flex items-center px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaTrash className="mr-2" />
                Удалить
              </button>
            </>
          )}
          {clipboard && (
            <button
              onClick={() => {/* Реализовать вставку */}}
              className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaPaste className="mr-2" />
              Вставить
            </button>
          )}
        </div>
      </div>

      {/* Список файлов */}
      <div className="flex-1 overflow-y-auto p-4">
        {viewMode === 'list' ? (
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2 font-medium">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1"
                  >
                    <span>Имя</span>
                    {sortBy === 'name' && (
                      <FaSort className={sortOrder === 'asc' ? 'transform rotate-180' : ''} />
                    )}
                  </button>
                </th>
                <th className="pb-2 font-medium">
                  <button
                    onClick={() => handleSort('modified')}
                    className="flex items-center space-x-1"
                  >
                    <span>Изменен</span>
                    {sortBy === 'modified' && (
                      <FaSort className={sortOrder === 'asc' ? 'transform rotate-180' : ''} />
                    )}
                  </button>
                </th>
                <th className="pb-2 font-medium">
                  <button
                    onClick={() => handleSort('size')}
                    className="flex items-center space-x-1"
                  >
                    <span>Размер</span>
                    {sortBy === 'size' && (
                      <FaSort className={sortOrder === 'asc' ? 'transform rotate-180' : ''} />
                    )}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {getCurrentFiles().map((file) => (
                <tr
                  key={file.id}
                  onClick={(e) => handleItemClick(file, e)}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedItems.includes(file.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="py-2">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(file)}
                      <span>{file.name}</span>
                    </div>
                  </td>
                  <td className="py-2 text-gray-500">
                    {new Date(file.modified).toLocaleString('ru')}
                  </td>
                  <td className="py-2 text-gray-500">{formatSize(file.size)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {getCurrentFiles().map((file) => (
              <div
                key={file.id}
                onClick={(e) => handleItemClick(file, e)}
                className={`p-4 rounded-lg border hover:border-blue-200 cursor-pointer transition-colors ${
                  selectedItems.includes(file.id)
                    ? 'bg-blue-50 border-blue-200'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="text-3xl">{getFileIcon(file)}</div>
                  <div className="text-sm font-medium truncate w-full">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatSize(file.size)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно создания нового элемента */}
      {showNewItemDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Создать новый элемент
              </h2>
              <button
                onClick={() => setShowNewItemDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setNewItemType('folder')}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      newItemType === 'folder'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaFolder className="inline-block mr-2" />
                    Папка
                  </button>
                  <button
                    onClick={() => setNewItemType('file')}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      newItemType === 'file'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaFile className="inline-block mr-2" />
                    Файл
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder={`Введите название ${
                    newItemType === 'folder' ? 'папки' : 'файла'
                  }`}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowNewItemDialog(false)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  /* Реализовать создание нового элемента */
                  setShowNewItemDialog(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesPage; 