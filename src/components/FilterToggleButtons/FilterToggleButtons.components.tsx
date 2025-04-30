import {useState} from 'react';
import {FaTable, FaTh} from 'react-icons/fa';

export default function FilterToggleButtons() {
    const [activeFilter, setActiveFilter] = useState<'table' | 'grid'>('table');

    return (
        <div className="flex-1 flex justify-end">
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setActiveFilter('table')}
                    className={`px-4 py-2 rounded-md flex items-center ${
                        activeFilter === 'table'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    <FaTable className="mr-2"/>
                    Таблица
                </button>

                <button
                    onClick={() => setActiveFilter('grid')}
                    className={`px-4 py-2 rounded-md flex items-center ${
                        activeFilter === 'grid'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    <FaTh className="mr-2"/>
                    Сетка
                </button>
            </div>
        </div>
    );
}