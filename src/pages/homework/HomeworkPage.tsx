import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import { getHomework, submitSolution } from "../../entities/homework/api/homework.api";
import { Homework } from "../../shared/types/homework";

const HomeworkPage = () => {
  const { homeworkId } = useParams<{ homeworkId: string }>();
  const [homework, setHomework] = useState<Homework | null>(null);
  const [solution, setSolution] = useState<string>("");
  const [solutions, setSolutions] = useState<string[]>([]);

  useEffect(() => {
    if (homeworkId) {
      const fetchHomework = async () => {
        try {
          const data = await getHomework({ id: homeworkId });
          setHomework(data[0]);
        } catch (error) {
          console.error("Ошибка при загрузке домашнего задания:", error);
        }
      };
      fetchHomework();
    }
  }, [homeworkId]);

  const handleSolutionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSolution(e.target.value);
  };

  const handleSubmitSolution = async () => {
    if (homework) {
      await submitSolution(homework.id, solution);
      alert("Решение отправлено");
    }
  };

  const handleViewSolutions = async () => {
    setSolutions(["Решение 1", "Решение 2", "Решение 3"]);
  };

  return (
    <div>
      {homework ? (
        <>
          <h1 className="text-2xl font-bold text-gray-800">{homework.name}</h1>
          <p className="text-gray-600">{homework.description}</p>
          <p className="font-semibold text-gray-800">
            <strong>Срок сдачи:</strong> {homework.deadline}
          </p>

          <div className="mt-6">
            <h3 className="text-xl font-semibold">Материалы</h3>
            <p className="text-gray-700">Название материала: {homework.material.name}</p>
            <p className="text-gray-500">{homework.material.videoUrl}</p>
            <p className="text-gray-500">{homework.material.presentationUrl}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold">Отправить решение</h3>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg mt-2"
              value={solution}
              onChange={handleSolutionChange}
              rows={4}
            />
            <button
              onClick={handleSubmitSolution}
              className="mt-4 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Отправить решение
            </button>
          </div>

          {/* Кнопка для учителя */}
          <button
            onClick={handleViewSolutions}
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Просмотр решений
          </button>

          {/* Отображение решений для учителя */}
          {solutions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Отправленные решения</h3>
              {solutions.map((sol, index) => (
                <div key={index} className="mt-2 p-4 border border-gray-300 rounded-lg">
                  <p className="text-gray-700">{sol}</p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-600">Загружаем домашнее задание...</p>
      )}
    </div>
  );
};

export default HomeworkPage;
