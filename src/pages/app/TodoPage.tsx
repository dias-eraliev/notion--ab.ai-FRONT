import React, { useState } from 'react';
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
  FaSort,
  FaList,
  FaColumns,
  FaUser,
  FaUsers
} from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface User {
  id: string;
  name: string;
  avatar?: string;
  role: 'teacher' | 'admin' | 'staff';
}

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  important: boolean;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  assignee?: User;
  watchers: User[];
  priority: 'low' | 'medium' | 'high';
}

const TodoPage: React.FC = () => {
  // Пример пользователей
  const users: User[] = [
    { id: '1', name: 'Иванов А.П.', role: 'teacher' },
    { id: '2', name: 'Петрова Е.С.', role: 'teacher' },
    { id: '3', name: 'Сидоров И.М.', role: 'admin' },
    { id: '4', name: 'Козлова О.В.', role: 'staff' }
  ];

  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      title: 'Проверить домашние задания',
      description: 'Проверить и оценить домашние работы учеников 9-го класса',
      completed: false,
      important: true,
      dueDate: '2025-04-15T10:00',
      tags: ['Проверка', 'Домашняя работа'],
      createdAt: '2025-04-10T08:30',
      status: 'todo',
      assignee: users[0],
      watchers: [users[1]],
      priority: 'high'
    },
    {
      id: '2',
      title: 'Подготовить материалы к уроку',
      description: 'Презентация и раздаточные материалы по теме "Квадратные уравнения"',
      completed: false,
      important: true,
      dueDate: '2025-04-15T10:00',
      tags: ['Математика', 'Урок'],
      createdAt: '2025-04-10T09:00',
      status: 'in_progress',
      assignee: users[1],
      watchers: [users[0], users[2]],
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Заполнить журнал успеваемости',
      description: 'Внести оценки за контрольную работу в электронный журнал',
      completed: false,
      important: false,
      dueDate: '2025-04-16T15:00',
      tags: ['Журнал', 'Оценки'],
      createdAt: '2025-04-10T10:00',
      status: 'review',
      assignee: users[0],
      watchers: [],
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Подготовить отчет по успеваемости',
      description: 'Составить отчет об успеваемости учеников за третью четверть',
      completed: false,
      important: true,
      dueDate: '2025-04-20T17:00',
      tags: ['Отчет', 'Аналитика'],
      createdAt: '2025-04-12T11:30',
      status: 'todo',
      assignee: users[2],
      watchers: [users[0]],
      priority: 'high'
    },
    {
      id: '5',
      title: 'Организовать родительское собрание',
      description: 'Подготовить повестку дня и раздаточные материалы для родителей',
      completed: false,
      important: true,
      dueDate: '2025-04-25T18:00',
      tags: ['Собрание', 'Организация'],
      createdAt: '2025-04-13T09:15',
      status: 'in_progress',
      assignee: users[3],
      watchers: [users[0], users[1]],
      priority: 'medium'
    },
    {
      id: '6',
      title: 'Разработать план внеклассного мероприятия',
      description: 'Создать план проведения литературного вечера для старшеклассников',
      completed: true,
      important: false,
      dueDate: '2025-04-18T14:00',
      tags: ['Мероприятие', 'Планирование'],
      createdAt: '2025-04-10T13:45',
      status: 'done',
      assignee: users[1],
      watchers: [users[3]],
      priority: 'low'
    },
    {
      id: '7',
      title: 'Проверить контрольные работы',
      description: 'Проверить и оценить контрольные работы по алгебре 10-го класса',
      completed: false,
      important: false,
      dueDate: '2025-04-17T16:00',
      tags: ['Проверка', 'Контрольная'],
      createdAt: '2025-04-15T10:30',
      status: 'review',
      assignee: users[0],
      watchers: [],
      priority: 'medium'
    },
    {
      id: '8',
      title: 'Составить расписание консультаций',
      description: 'Подготовить график индивидуальных консультаций для выпускников',
      completed: false,
      important: true,
      dueDate: '2025-04-19T12:00',
      tags: ['Расписание', 'Консультации'],
      createdAt: '2025-04-14T08:00',
      status: 'todo',
      assignee: users[2],
      watchers: [users[1]],
      priority: 'high'
    },
    {
      id: '9',
      title: 'Заказать учебные материалы',
      description: 'Составить список и оформить заказ учебников на следующий учебный год',
      completed: true,
      important: false,
      dueDate: '2025-04-21T11:00',
      tags: ['Заказ', 'Материалы'],
      createdAt: '2025-04-13T14:20',
      status: 'done',
      assignee: users[3],
      watchers: [users[2]],
      priority: 'medium'
    },
    {
      id: '10',
      title: 'Подготовить олимпиадные задания',
      description: 'Разработать задания для школьной олимпиады по физике',
      completed: false,
      important: true,
      dueDate: '2025-04-22T15:30',
      tags: ['Олимпиада', 'Задания'],
      createdAt: '2025-04-14T16:45',
      status: 'in_progress',
      assignee: users[1],
      watchers: [],
      priority: 'high'
    }
  ]);

  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'importance'>('date');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Получаем все уникальные теги
  const allTags = Array.from(
    new Set(todos.flatMap((todo) => todo.tags))
  ).sort();

  // Фильтрация задач
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

  const columns = {
    todo: {
      title: 'К выполнению',
      items: filteredTodos.filter(todo => todo.status === 'todo')
    },
    in_progress: {
      title: 'В работе',
      items: filteredTodos.filter(todo => todo.status === 'in_progress')
    },
    review: {
      title: 'На проверке',
      items: filteredTodos.filter(todo => todo.status === 'review')
    },
    done: {
      title: 'Выполнено',
      items: filteredTodos.filter(todo => todo.status === 'done')
    }
  };

  const handleAddTodo = (todo: Omit<Todo, 'id' | 'createdAt' | 'status' | 'watchers'>) => {
    const newTodo: Todo = {
      ...todo,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      status: 'todo',
      watchers: [],
      completed: false,
      priority: todo.priority || 'medium'
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

  const onDragEnd = (result: any) => {
    // Если нет назначения или перетаскивание вне дропзон, ничего не делаем
    if (!result.destination) return;

    const { source, destination } = result;

    // Если место назначения то же самое, что и источник, ничего не делаем
    if (source.droppableId === destination.droppableId && 
        source.index === destination.index) {
      return;
    }

    // Получаем копию текущего состояния todos
    const updatedTodos = Array.from(todos);

    // Находим перетаскиваемую задачу по id
    const sourceColumnItems = columns[source.droppableId as keyof typeof columns].items;
    const draggedItem = sourceColumnItems[source.index];

    // Обновляем статус задачи и, если перемещаем в "Выполнено", отмечаем как completed
    const newStatus = destination.droppableId as Todo['status'];
    
    // Важно создать новый объект, а не изменять существующий
    const updatedTask = {
      ...draggedItem,
      status: newStatus,
      completed: newStatus === 'done' ? true : (newStatus !== 'done' && source.droppableId === 'done' ? false : draggedItem.completed)
    };
    
    // Обновляем задачу в массиве todos
    const todoIndex = updatedTodos.findIndex(todo => todo.id === draggedItem.id);
    updatedTodos[todoIndex] = updatedTask;
    
    // Обновляем состояние
    setTodos(updatedTodos);
  };

  // Отрисовка одной карточки задачи
  const renderCard = (todo: Todo, index: number) => (
    <Draggable 
      key={todo.id} 
      draggableId={todo.id} 
      index={index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-white rounded-lg p-4 mb-3 border border-gray-200
            ${snapshot.isDragging ? 'shadow-lg ring-2 ring-corporate-primary/20' : 'shadow-sm hover:shadow-md'}
            transition-all duration-200 cursor-move
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-semibold ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
              {todo.title}
            </h4>
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateTodo({ ...todo, important: !todo.important });
                }}
                className={`p-1 rounded hover:bg-gray-100 ${
                  todo.important ? 'text-yellow-500' : 'text-gray-400'
                }`}
              >
                {todo.important ? <FaStar /> : <FaRegStar />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingTodo(todo);
                }}
                className="p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded"
              >
                <FaEdit />
              </button>
            </div>
          </div>
          
          {todo.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {todo.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            {todo.assignee && (
              <div className="flex items-center gap-2">
                <FaUser className="text-gray-400" />
                <span>{todo.assignee.name}</span>
              </div>
            )}
            {todo.dueDate && (
              <div className="flex items-center gap-2">
                <FaClock className="text-gray-400" />
                <span>{new Date(todo.dueDate).toLocaleDateString('ru')}</span>
              </div>
            )}
          </div>
          
          {todo.tags && todo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {todo.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-corporate-primary/10 text-corporate-primary text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Индикатор приоритета */}
          <div className="mt-2 flex justify-end">
            <span 
              className={`inline-block w-2 h-2 rounded-full ${
                todo.priority === 'high' ? 'bg-red-500' : 
                todo.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            />
          </div>
        </div>
      )}
    </Draggable>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      {/* Верхняя панель */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-[#1E5945]">Список задач</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-colors ${
                  view === 'list'
                    ? 'bg-white text-corporate-primary shadow-sm'
                    : 'text-gray-500 hover:text-corporate-primary'
                }`}
              >
                <FaList />
              </button>
              <button
                onClick={() => setView('kanban')}
                className={`p-2 rounded-lg transition-colors ${
                  view === 'kanban'
                    ? 'bg-white text-corporate-primary shadow-sm'
                    : 'text-gray-500 hover:text-corporate-primary'
                }`}
              >
                <FaColumns />
              </button>
            </div>
            <button
              onClick={() => setShowAddTodo(true)}
              className="flex items-center px-4 py-2 bg-[#1E5945] text-white rounded-lg hover:bg-[#1E5945]/90 transition-colors"
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
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-corporate-primary"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-corporate-primary/10 text-corporate-primary' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FaFilter />
            </button>
            <button
              onClick={() => setSortBy(sortBy === 'date' ? 'importance' : 'date')}
              className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FaSort />
            </button>
          </div>
        </div>

        {/* Панель фильтров */}
        {showFilters && (
          <div className="bg-[#1E5945]/10 p-4 rounded-lg">
            <label className="block text-sm font-medium text-[#1E5945] mb-3">
              Фильтры
            </label>
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
                      ? 'bg-corporate-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
              <button
                onClick={() => setSelectedTags([])}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Основная область */}
      <div className="flex-1 p-4 overflow-auto">
        {view === 'list' ? (
          <div className="space-y-4">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white rounded-lg border ${
                  todo.completed ? 'border-gray-200' : 'border-corporate-primary/20'
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
                    <div>
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
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        {todo.dueDate && (
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2" />
                            {new Date(todo.dueDate).toLocaleString('ru', {
                              day: 'numeric',
                              month: 'long',
                              hour: 'numeric',
                              minute: 'numeric'
                            })}
                          </div>
                        )}
                        {todo.assignee && (
                          <div className="flex items-center">
                            <FaUser className="mr-2" />
                            {todo.assignee.name}
                          </div>
                        )}
                        {todo.watchers.length > 0 && (
                          <div className="flex items-center">
                            <FaUsers className="mr-2" />
                            {todo.watchers.length} наблюдателей
                          </div>
                        )}
                      </div>
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
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 h-full overflow-x-auto pb-4">
              {Object.keys(columns).map(columnId => {
                const column = columns[columnId as keyof typeof columns];
                return (
                  <div key={columnId} className="min-w-[300px] max-w-[350px] flex-1">
                    <h3 className="font-semibold text-lg mb-3 text-gray-700">{column.title}</h3>
                    <Droppable droppableId={columnId}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`
                            min-h-[200px] p-3 rounded-lg
                            ${snapshot.isDraggingOver ? 'bg-corporate-primary/5' : 'bg-gray-100'}
                            transition-colors duration-200
                          `}
                        >
                          {column.items.map((item, index) => renderCard(item, index))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        )}
      </div>

      {/* Модальное окно создания/редактирования задачи */}
      {(showAddTodo || editingTodo) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-corporate-primary">
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
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-corporate-primary mb-2">
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-corporate-primary"
                  placeholder="Введите название задачи"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-corporate-primary mb-2">
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-corporate-primary resize-none"
                  placeholder="Добавьте описание задачи"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-corporate-primary mb-2">
                    Срок выполнения
                  </label>
                  <input
                    type="datetime-local"
                    value={editingTodo?.dueDate?.slice(0, 16) || ''}
                    onChange={(e) =>
                      editingTodo
                        ? setEditingTodo({
                            ...editingTodo,
                            dueDate: e.target.value
                          })
                        : null
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-corporate-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-corporate-primary mb-2">
                    Ответственный
                  </label>
                  <select
                    value={editingTodo?.assignee?.id || ''}
                    onChange={(e) =>
                      editingTodo
                        ? setEditingTodo({
                            ...editingTodo,
                            assignee: users.find(u => u.id === e.target.value)
                          })
                        : null
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-corporate-primary"
                  >
                    <option value="">Выберите ответственного</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-corporate-primary mb-2">
                  Приоритет
                </label>
                <div className="flex space-x-4">
                  {['low', 'medium', 'high'].map(priority => (
                    <label key={priority} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio" 
                        checked={editingTodo?.priority === priority}
                        onChange={() => editingTodo && setEditingTodo({...editingTodo, priority: priority as Todo['priority']})}
                        className="h-4 w-4"
                      />
                      <span className="text-sm capitalize">
                        {priority === 'low' ? 'Низкий' : priority === 'medium' ? 'Средний' : 'Высокий'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-corporate-primary mb-2">
                  Наблюдатели
                </label>
                <div className="space-y-2">
                  {users.map(user => (
                    <label key={user.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingTodo?.watchers.some(w => w.id === user.id)}
                        onChange={(e) => {
                          if (!editingTodo) return;
                          const watchers = e.target.checked
                            ? [...editingTodo.watchers, user]
                            : editingTodo.watchers.filter(w => w.id !== user.id);
                          setEditingTodo({ ...editingTodo, watchers });
                        }}
                        className="mr-2 h-4 w-4 rounded border-gray-300 text-corporate-primary focus:ring-corporate-primary"
                      />
                      <span className="text-sm text-gray-700">{user.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-corporate-primary mb-2">
                  Теги
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (!editingTodo) return;
                        const tags = editingTodo.tags.includes(tag)
                          ? editingTodo.tags.filter((t) => t !== tag)
                          : [...editingTodo.tags, tag];
                        setEditingTodo({ ...editingTodo, tags });
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        editingTodo?.tags.includes(tag)
                          ? 'bg-corporate-primary text-white'
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

              <div className="flex justify-between pt-6">
                {editingTodo?.id && (
                  <button
                    onClick={() => {
                      handleDeleteTodo(editingTodo.id);
                      setEditingTodo(null);
                    }}
                    className="flex items-center px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash className="mr-2" />
                    Удалить
                  </button>
                )}
                <div className="space-x-2">
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
                      if (editingTodo?.id) {
                        handleUpdateTodo(editingTodo);
                      } else if (editingTodo) {
                        handleAddTodo(editingTodo);
                      }
                    }}
                    className="flex items-center px-4 py-2 bg-corporate-primary text-white rounded-lg hover:bg-corporate-primary/90 transition-colors"
                  >
                    <FaCheck className="mr-2" />
                    {editingTodo?.id ? 'Сохранить' : 'Добавить'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoPage;