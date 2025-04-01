import React, { useState, useEffect } from 'react';
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrash,
  FaStar,
  FaRegStar,
  FaCalendarAlt,
  FaClock,
  FaTag,
  FaSort
} from 'react-icons/fa';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  important: boolean;
  dueDate?: string;
  tags: string[];
  createdAt: string;
}

const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      title: 'Подготовить материалы к уроку',
      description: 'Презентация и раздаточные материалы по теме "Квадратные уравнения"',
      completed: false,
      important: true,
      dueDate: '2024-03-15T10:00',
      tags: ['Математика', 'Урок'],
      createdAt: '2024-03-10T08:30'
    },
    {
      id: '2',
      title: 'Проверить домашние задания',
      description: 'Проверить и оценить домашние работы учеников 9-го класса',
      completed: true,
      important: false,
      tags: ['Проверка', 'Домашняя работа'],
      createdAt: '2024-03-10T09:00'
    }
  ]);

  const [showAddTodo, setShowAddTodo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'importance'>('date');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const allTags = Array.from(
    new Set(todos.flatMap((todo) => todo.tags))
  ).sort();

  const filteredTodos = todos
    .filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) => todo.tags.includes(tag)))
    )
    .sort((a, b) => {
      if (sortBy === 'importance') {
        return b.important === a.important ? 0 : b.important ? 1 : -1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleAddTodo = (todo: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todo,
      id: String(Date.now()),
      createdAt: new Date().toISOString()
    };
    setTodos([...todos, newTodo]);
    setShowAddTodo(false);
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setTodos(
      todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
    setEditingTodo(null);
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      {/* Верхняя панель */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Список дел</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAddTodo(true)}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaPlus className="mr-2" />
              Добавить задачу
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск задач..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-50 text-blue-500' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FaFilter />
            </button>
            <button
              onClick={() =>
                setSortBy(sortBy === 'date' ? 'importance' : 'date')
              }
              className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FaSort />
            </button>
          </div>
        </div>
        {showFilters && (
          <div className="flex items-center space-x-4 mt-4">
            <div className="text-sm text-gray-500">Фильтр по тегам:</div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTags(
                      selectedTags.includes(tag)
                        ? selectedTags.filter((t) => t !== tag)
                        : [...selectedTags, tag]
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Список задач */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`bg-white rounded-lg border ${
                todo.completed ? 'border-gray-200' : 'border-blue-200'
              } p-4 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() =>
                      handleUpdateTodo({ ...todo, completed: !todo.completed })
                    }
                    className={`p-2 rounded-full transition-colors ${
                      todo.completed
                        ? 'bg-green-100 text-green-500'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    <FaCheck />
                  </button>
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-medium ${
                        todo.completed
                          ? 'text-gray-500 line-through'
                          : 'text-gray-900'
                      }`}
                    >
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="mt-1 text-gray-600">{todo.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {todo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {todo.dueDate && (
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="mr-2" />
                        {new Date(todo.dueDate).toLocaleString('ru', {
                          day: 'numeric',
                          month: 'long',
                          hour: 'numeric',
                          minute: 'numeric'
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleUpdateTodo({ ...todo, important: !todo.important })
                    }
                    className={`p-2 rounded-lg transition-colors ${
                      todo.important
                        ? 'text-yellow-500'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {todo.important ? <FaStar /> : <FaRegStar />}
                  </button>
                  <button
                    onClick={() => setEditingTodo(todo)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Модальное окно добавления/редактирования задачи */}
      {(showAddTodo || editingTodo) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingTodo ? 'Редактировать задачу' : 'Новая задача'}
              </h2>
              <button
                onClick={() => {
                  setShowAddTodo(false);
                  setEditingTodo(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название
                </label>
                <input
                  type="text"
                  value={editingTodo?.title || ''}
                  onChange={(e) =>
                    editingTodo
                      ? setEditingTodo({ ...editingTodo, title: e.target.value })
                      : null
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Введите название задачи"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  value={editingTodo?.description || ''}
                  onChange={(e) =>
                    editingTodo
                      ? setEditingTodo({
                          ...editingTodo,
                          description: e.target.value
                        })
                      : null
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Добавьте описание задачи"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Срок выполнения
                </label>
                <input
                  type="datetime-local"
                  value={editingTodo?.dueDate || ''}
                  onChange={(e) =>
                    editingTodo
                      ? setEditingTodo({
                          ...editingTodo,
                          dueDate: e.target.value
                        })
                      : null
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Теги
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        editingTodo
                          ? setEditingTodo({
                              ...editingTodo,
                              tags: editingTodo.tags.includes(tag)
                                ? editingTodo.tags.filter((t) => t !== tag)
                                : [...editingTodo.tags, tag]
                            })
                          : null
                      }
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        editingTodo?.tags.includes(tag)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      const newTag = prompt('Введите новый тег');
                      if (newTag && editingTodo) {
                        setEditingTodo({
                          ...editingTodo,
                          tags: [...editingTodo.tags, newTag]
                        });
                      }
                    }}
                    className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm transition-colors"
                  >
                    <FaPlus className="inline-block mr-1" />
                    Добавить тег
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setShowAddTodo(false);
                  setEditingTodo(null);
                }}
                className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  if (editingTodo) {
                    handleUpdateTodo(editingTodo);
                  } else {
                    handleAddTodo({
                      title: '',
                      completed: false,
                      important: false,
                      tags: []
                    });
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {editingTodo ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoPage; 