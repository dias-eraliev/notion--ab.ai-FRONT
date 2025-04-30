import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    FaUserGraduate,
    FaPhone,
    FaEnvelope,
    FaIdCard,
    FaSmile,
    FaBrain,
    FaUsers,
    FaBookReader,
    FaComments,
    FaBriefcase,
    FaMoneyBillWave,
    FaCreditCard,
    FaFileInvoiceDollar,
    FaHistory,
    FaTimes,
    FaDownload,
    FaAward,
    FaChalkboardTeacher,
    FaMedal,
    FaCertificate
} from 'react-icons/fa';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {IStudent} from "@/Interfeces/Student.interface.ts";
import {IPaymentFormData} from "@/Interfeces/PaymentFormData.interface.ts";
import {IDateFilter} from "@/Interfeces/DateFilter.interface.ts";
import {IExamFilter} from "@/Interfeces/ExamFilter.interface.ts";
import {IExamResult} from "@/Interfeces/ExamResult.interface.ts";
import {StudentsRequests} from "@/api/Requests/Students.requests.ts";
import {JsPDFWithPluginType} from "@/Types/JsPDFWithPlugin.type.ts";
import {IExtracurricularActivity} from "@/Interfeces/ExtracurricularActivity.interface.ts";
import {examResults, examSummary, examTypes} from '@/api/MockDataBase/examResults.db';
import {emotionalStates} from "@/api/MockDataBase/emotionalStates.db.ts";
import {attendanceData, performanceData, skillsData} from '@/api/MockDataBase/charts.db';
import {developmentPlans} from '@/api/MockDataBase/developmentPlans.db';
import {attendanceStats} from "@/api/MockDataBase/attendanceStats.db.ts";
import {paymentTypes} from "@/api/MockDataBase/paymentTypes.db.ts";
import {financialSummary, payments, paymentTrends} from "@/api/MockDataBase/payments.db.ts";
import {schedule} from '@/api/MockDataBase/schedule.db';
import {extracurricularActivities} from "@/api/MockDataBase/extracurricularActivities.db.ts";
import {getStatusColor} from "@/Types/getStatusColor.type.ts";
import {getStatusText} from "@/Types/getStatusText.type.ts";
import {getTypeText} from "@/Types/getTypeText.type.ts";


// Экземпляр запросов класса студентов
const StudentsReq = new StudentsRequests()


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StudentDetailPage: React.FC = () => {

    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [students, setStudents] = useState<IStudent>();
    const [activeTab, setActiveTab] = useState('overview');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentFormData, setPaymentFormData] = useState<IPaymentFormData>({
        type: '',
        amount: 2500,
        dueDate: '',
        description: '',
        discount: 0
    });
    const [dateFilter, setDateFilter] = useState<IDateFilter>({
        type: 'week',
        value: 'current'
    });
    const [examFilter, setExamFilter] = useState<IExamFilter>({
        year: '2024/2025',
        quarter: 'all',
        month: 'all',
        examType: 'all'
    });
    const [selectedExam, setSelectedExam] = useState<IExamResult | null>(null);

    // Эффект для загрузки студентов при изменении страницы, класса или поискового запроса
    useEffect(() => {
        const students = async () => {
            const GetStudents = await StudentsReq.fetchStudentsById(Number(id));

            console.log(GetStudents?.data)

            if (GetStudents?.data) { // проверяем что точно есть ответ и данные
                setStudents(GetStudents.data)
            } else {
                console.error("No students data received.");
            }
        }

        students()


        //     Дальше остальные данные можно будет подгружать по аналогу
    }, []);


    // console.log(students?.lessonGrades)


    const getScoreColor = (score: number) => {
        if (score >= 85) return 'bg-green-100 text-green-800';
        if (score >= 70) return 'bg-blue-100 text-blue-800';
        if (score >= 50) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
        switch (trend) {
            case 'up':
                return <span className="text-green-500">↑</span>;
            case 'down':
                return <span className="text-red-500">↓</span>;
            default:
                return <span className="text-gray-500">→</span>;
        }
    };

    const getStateIcon = (category: string) => {
        switch (category) {
            case 'Общее настроение':
                return <FaSmile className="w-8 h-8 text-yellow-400"/>;
            case 'Концентрация':
                return <FaBrain className="w-8 h-8 text-purple-400"/>;
            case 'Социализация':
                return <FaUsers className="w-8 h-8 text-blue-400"/>;
            case 'Учебная мотивация':
                return <FaBookReader className="w-8 h-8 text-green-400"/>;
            default:
                return null;
        }
    };

    const handleChatWithParent = (parentId: string, parentName: string) => {
        navigate('/chat', {
            state: {
                recipientId: parentId,
                recipientName: parentName
            }
        });
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Здесь будет логика отправки данных на сервер
        console.log('Payment Form Data:', paymentFormData);
        setIsPaymentModalOpen(false);
        // Сбросим форму
        setPaymentFormData({
            type: '',
            amount: 2500,
            dueDate: '',
            description: '',
            discount: 0
        });
    };

    const filteredExams = examResults.filter(exam => {
        if (examFilter.year !== 'all' && exam.date !== examFilter.year) return false;

        // Фильтрация по четверти
        if (examFilter.quarter !== 'all') {
            const examMonth = parseInt(exam.examType.split(' ')[2].replace('(', ''));
            const quarter = Math.ceil(examMonth / 3);
            if (quarter.toString() !== examFilter.quarter) return false;
        }

        // Фильтрация по месяцу
        if (examFilter.month !== 'all') {
            const examMonth = parseInt(exam.examType.split(' ')[2].replace('(', ''));
            if (examMonth.toString() !== examFilter.month) return false;
        }

        // Фильтрация по типу экзамена
        if (examFilter.examType !== 'all') {
            const examTypeMatch = examTypes.find(type => type.id === examFilter.examType);
            if (!exam.examType.includes(examTypeMatch?.label || '')) return false;
        }

        return true;
    });

    // Обновляем итоговую статистику на основе отфильтрованных экзаменов
    const filteredExamSummary = {
        totalExams: filteredExams.length,
        passed: filteredExams.filter(exam => exam.result === 'Сдано').length,
        failed: filteredExams.filter(exam => exam.result === 'Не сдано').length,
        averageScore: filteredExams.reduce((acc, exam) => acc + exam.score, 0) / filteredExams.length || 0,
        totalScore: filteredExams.reduce((acc, exam) => acc + exam.score, 0),
        maxPossibleScore: filteredExams.length * 100,
        ranking: examSummary.ranking, // Оставляем оригинальный рейтинг
        percentage: (filteredExams.reduce((acc, exam) => acc + exam.score, 0) / (filteredExams.length * 100)) * 100 || 0
    };

    // Функция для экспорта результатов в PDF
    const exportToPDF = () => {
        const doc = new jsPDF('p', 'mm', 'a4') as JsPDFWithPluginType;

        // Заголовок
        doc.setFontSize(16);
        doc.text('Результаты экзаменов', 14, 15);
        doc.setFontSize(12);
        doc.text(`Студент: ${students?.name}`, 14, 25);
        // doc.text(`Класс: ${student.class}`, 14, 32);
        doc.text(`Учебный год: ${examFilter.year}`, 14, 39);

        // Таблица результатов
        const tableData = filteredExams.map(exam => [
            `${exam.subject} (${exam.code})`,
            exam.maxScore.toString(),
            exam.score.toString(),
            exam.classAverageScore?.toString() || '-',
            exam.result
        ]);

        doc.autoTable({
            head: [['Предмет', 'Макс. балл', 'Получено', 'Средний балл', 'Результат']],
            body: tableData,
            startY: 45,
            theme: 'grid',
            styles: {fontSize: 10},
            headStyles: {fillColor: [41, 128, 185]}
        });

        // Итоговая статистика
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.text(`Общий рейтинг: ${filteredExamSummary.ranking}`, 14, finalY);
        doc.text(`Средний балл: ${filteredExamSummary.averageScore.toFixed(1)}`, 14, finalY + 7);
        doc.text(`Процент успеваемости: ${filteredExamSummary.percentage.toFixed(2)}%`, 14, finalY + 14);

        // Сохранение файла
        doc.save(`Результаты_экзаменов_${students?.name}.pdf`);
    };

    const getActivityTypeColor = (type: IExtracurricularActivity['type']) => {
        switch (type) {
            case 'club':
                return 'bg-blue-500 text-white';
            case 'organization':
                return 'bg-green-500 text-white';
            case 'course':
                return 'bg-yellow-500 text-white';
            case 'olympiad':
                return 'bg-purple-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const getActivityTypeIcon = (type: IExtracurricularActivity['type']) => {
        switch (type) {
            case 'club':
                return <FaChalkboardTeacher className="w-6 h-6"/>;
            case 'organization':
                return <FaUsers className="w-6 h-6"/>;
            case 'course':
                return <FaBookReader className="w-6 h-6"/>;
            case 'olympiad':
                return <FaMedal className="w-6 h-6"/>;
            default:
                return null;
        }
    };

    const getActivityStatusColor = (status: IExtracurricularActivity['status']) => {
        switch (status) {
            case 'active':
                return 'bg-green-500 text-white';
            case 'completed':
                return 'bg-blue-500 text-white';
            case 'planned':
                return 'bg-yellow-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const getActivityStatusText = (status: IExtracurricularActivity['status']) => {
        switch (status) {
            case 'active':
                return 'Активно';
            case 'completed':
                return 'Завершено';
            case 'planned':
                return 'Планируется';
            default:
                return status;
        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                        <img
                          src="https://media.istockphoto.com/id/588348500/nl/vector/male-avatar-profile-picture-vector.jpg?s=612x612&w=0&k=20&c=5IcAtIJUOTcrRDxQd5Q6Yi8C83ptgrOgXTCP-GaDrRY="
                          alt={students?.name + " " + students?.surname + " " + students?.lastname}
                          className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{students?.name + " " + students?.surname + " " + students?.lastname}</h1>
                                <div className="flex items-center gap-4 mt-2 text-gray-600">
                                    <div className="flex items-center">
                                        <FaUserGraduate className="w-4 h-4 mr-2"/>
                                        {/*<span>{student.class}</span>*/}
                                    </div>
                                    <div className="flex items-center">
                                        <FaIdCard className="w-4 h-4 mr-2"/>
                                        {/*<span>{student.iin}</span>*/}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/chat')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <FaComments className="w-4 h-4"/>
                                Написать
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 mt-8 border-b border-gray-200">
                    <button
                        className={`pb-4 px-2 text-sm font-medium ${
                            activeTab === 'overview'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Обзор
                    </button>
                    <button
                        className={`pb-4 px-2 text-sm font-medium ${
                            activeTab === 'performance'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('performance')}
                    >
                        Успеваемость
                    </button>
                    <button
                        className={`pb-4 px-2 text-sm font-medium ${
                            activeTab === 'attendance'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('attendance')}
                    >
                        Посещаемость
                    </button>
                    <button
                        className={`pb-4 px-2 text-sm font-medium ${
                            activeTab === 'finance'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('finance')}
                    >
                        Финансы

                    </button>
                    <button
                        className={`pb-4 px-2 text-sm font-medium ${
                            activeTab === 'schedule'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('schedule')}
                    >
                        Расписание
                    </button>
                    <button
                        className={`pb-4 px-2 text-sm font-medium ${
                            activeTab === 'exams'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('exams')}
                    >
                        Экзамены и результаты
                    </button>
                    <button
                        className={`pb-4 px-2 text-sm font-medium ${
                            activeTab === 'extracurricular'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('extracurricular')}
                    >
                        Доп. образование
                    </button>
                </div>
            </div>

            {activeTab === 'overview' && (
                <>
                    {/* Психоэмоциональное состояние */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-6">Психоэмоциональное состояние</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {emotionalStates.map((state) => (
                                <div key={state.category} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            {getStateIcon(state.category)}
                                            <span className="ml-2 text-sm font-medium text-gray-600">
                        {state.category}
                      </span>
                                        </div>
                                        <span className="text-lg font-bold" style={{color: getScoreColor(state.score)}}>
                      {state.score}/100
                    </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{state.description}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Обновлено: {state.lastUpdate}</span>
                                        <div className="flex items-center">
                                            <span>Тренд:</span>
                                            {getTrendIcon(state.trend)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Контакты */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-6">Контакты</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Отец */}
                            {students?.Parent.relation === "FATHER" &&
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <FaUserGraduate className="w-5 h-5 text-gray-500"/>
                                            <span className="ml-2 font-medium">Отец</span>
                                        </div>
                                        <button
                                            onClick={() => handleChatWithParent(students?.Parent.relation, students?.Parent.user.username)}
                                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-xs hover:bg-blue-700"
                                        >
                                            Написать
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                        <span key={students?.id}>
                                                {students?.Parent.relation === "FATHER" ? students?.Parent.user.username : "Not a Fatcher" }
                                            </span>
                                        </p>

                                        <div className="flex items-center text-sm text-gray-600">
                                            {/*<FaPhone className="w-4 h-4 mr-2"/>*/}
                                            {/*<span>{students.}</span>*/}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FaEnvelope className="w-4 h-4 mr-2"/>
                                            <span>nurlan@example.com</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FaBriefcase className="w-4 h-4 mr-2"/>
                                            <span>Инженер<br/>ТОО "Технопром"</span>
                                        </div>
                                    </div>
                                </div>}

                            {/* Мать */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <FaUserGraduate className="w-5 h-5 text-gray-500"/>
                                        <span className="ml-2 font-medium">Мать</span>
                                    </div>
                                    <button
                                        onClick={() => handleChatWithParent('mother', 'Сатыбалды Айгуль')}
                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-xs hover:bg-blue-700"
                                    >
                                        Написать
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">Сатыбалды Айгуль</p>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaPhone className="w-4 h-4 mr-2"/>
                                        <span>+7 (777) 888-99-00</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaEnvelope className="w-4 h-4 mr-2"/>
                                        <span>aigul@example.com</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaBriefcase className="w-4 h-4 mr-2"/>
                                        <span>Врач<br/>Городская поликлиника №5</span>
                                    </div>
                                </div>
                            </div>

                            {/* Куратор */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <FaUserGraduate className="w-5 h-5 text-gray-500"/>
                                        <span className="ml-2 font-medium">Куратор</span>
                                    </div>
                                    <button
                                        onClick={() => handleChatWithParent('curator', 'Ахметова Динара')}
                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-xs hover:bg-blue-700"
                                    >
                                        Написать
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">Ахметова Динара</p>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaPhone className="w-4 h-4 mr-2"/>
                                        <span>+7 (777) 999-00-11</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaEnvelope className="w-4 h-4 mr-2"/>
                                        <span>akhmetova@example.com</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaBriefcase className="w-4 h-4 mr-2"/>
                                        <span>Куратор группы МК24-1М<br/>Школа №1</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Графики */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Динамика успеваемости */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-6">Динамика успеваемости</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="month"/>
                                    <YAxis domain={[0, 5]}/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Line type="monotone" dataKey="Математика" stroke="#8884d8"/>
                                    <Line type="monotone" dataKey="Физика" stroke="#82ca9d"/>
                                    <Line type="monotone" dataKey="Химия" stroke="#ffc658"/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Посещаемость */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-6">Посещаемость</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={attendanceData}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="subject"/>
                                    <YAxis domain={[0, 100]}/>
                                    <Tooltip/>
                                    <Bar dataKey="attendance" fill="#8884d8"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'performance' && (
                <div className="space-y-4">
                    {/* Текущая успеваемость */}
                    <div className="bg-white rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-medium text-gray-900">Текущая успеваемость</h2>
                            <p className="text-sm text-gray-500">Оценки и прогресс по предметам</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 p-4">

                            {students?.lessonGrades?.map((subject, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-gray-100 rounded-lg hover:border-blue-100 transition-all duration-200"
                                >
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base font-medium text-gray-900">{subject.lesson.name}</h3>
                                                <span className={`
                          px-1.5 py-0.5 rounded text-xs font-medium
                        `}>132
                          {/*{subject.trend === 'up' ? '↑' : subject.trend === 'down' ? '↓' : '→'}*/}
                          {/*                          {subject.currentGrade}*/}
                        </span>
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-500 mb-3">
                                            Преподаватель: {students?.Syllabus.teacherId}
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-50 rounded-lg p-2">
                                            <div>
                                                <div className="text-xs text-gray-500">Текущая</div>
                                                <div
                                                    className="text-lg font-medium text-gray-900">{subject.grade}</div>
                                            </div>
                                            {/*<div>*/}
                                            {/*    <div className="text-xs text-gray-500">Предыдущая</div>*/}
                                            {/*    <div*/}
                                            {/*        className="text-lg font-medium text-gray-900">{subject.previousGrade}</div>*/}
                                            {/*</div>*/}
                                            {/*<div>*/}
                                            {/*    <div className="text-xs text-gray-500">Средняя</div>*/}
                                            {/*    <div*/}
                                            {/*        className="text-lg font-medium text-gray-900">{subject.averageGrade}</div>*/}
                                            {/*</div>*/}
                                        </div>

                                        <div>
                                            <div className="text-xs text-gray-500 mb-2">Последние задания</div>
                                            <div className="space-y-1.5">
                                                {/*{subject.assignments.map((assignment, idx) => (*/}
                                                {/*))}*/}
                                                    <div
                                                        key={subject.id}
                                                        className="flex items-center justify-between py-0.5"
                                                    >
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                                            <span
                                                                className="text-xs text-gray-900">{subject.lessonId}</span>
                                                        </div>
                                                        <span className={`
                              px-1.5 py-0.5 rounded text-xs font-medium
                              ${subject.grade >= 4.5 ? 'bg-green-50 text-green-700' :
                                                            subject.grade >= 4 ? 'bg-blue-50 text-blue-700' :
                                                                'bg-yellow-50 text-yellow-700'}
                            `}>
                              {subject.grade}
                            </span>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Персональный план развития */}
                    <div className="bg-white rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-medium text-gray-900">Персональный план развития</h2>
                            <p className="text-sm text-gray-500">Цели и задачи для улучшения успеваемости</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 p-4">
                            {developmentPlans.map((plan, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-gray-100 rounded-lg hover:border-blue-100 transition-all duration-200"
                                >
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base font-medium text-gray-900">{plan.subject}</h3>
                                                <span
                                                    className={`px-1.5 py-0.5 rounded-xs text-xs font-medium ${getStatusColor(plan.status)}`}>
                          {getStatusText(plan.status)}
                        </span>
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-500 mb-3">
                                            Ментор: {plan.mentor}
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                            <div className="text-sm text-gray-900 mb-2">{plan.goal}</div>
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-gray-500">Прогресс к цели</span>
                                                <span className="text-gray-900">{plan.currentLevel}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1">
                                                <div
                                                    className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                                    style={{width: `${(plan.currentLevel / plan.targetLevel) * 100}%`}}
                                                ></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-xs text-gray-500 mb-2">Задачи</div>
                                            <div className="space-y-1.5">
                                                {plan.tasks.map((task, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between py-0.5"
                                                    >
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                                            <span className="text-xs text-gray-900">{task.title}</span>
                                                        </div>
                                                        <span
                                                            className={`px-1.5 py-0.5 rounded-xs text-xs font-medium ${getStatusColor(task.status)}`}>
                              {getStatusText(task.status)}
                            </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-2 text-right">
                                                Срок: {plan.deadline}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Графики успеваемости */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-base font-medium text-gray-900 mb-6">Динамика оценок по предметам</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                                    <XAxis dataKey="month" stroke="#6b7280"/>
                                    <YAxis domain={[0, 5]} stroke="#6b7280"/>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px'
                                        }}
                                    />
                                    <Legend/>
                                    <Line
                                        type="monotone"
                                        dataKey="Математика"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        dot={{r: 4}}
                                        activeDot={{r: 6}}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="Физика"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        dot={{r: 4}}
                                        activeDot={{r: 6}}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="Химия"
                                        stroke="#F59E0B"
                                        strokeWidth={2}
                                        dot={{r: 4}}
                                        activeDot={{r: 6}}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-base font-medium text-gray-900 mb-6">Распределение навыков</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={skillsData}>
                                    <PolarGrid stroke="#f0f0f0"/>
                                    <PolarAngleAxis dataKey="subject" stroke="#6b7280"/>
                                    <PolarRadiusAxis domain={[0, 100]} stroke="#6b7280"/>
                                    <Radar
                                        name="Текущие показатели"
                                        dataKey="value"
                                        stroke="#10B981"
                                        fill="#10B981"
                                        fillOpacity={0.2}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'attendance' && (
                <div className="space-y-6">
                    {/* История посещаемости */}
                    <div className="bg-white rounded-xl p-6">
                        <h2 className="text-xl font-medium text-gray-900 mb-1">История посещаемости</h2>
                        <p className="text-sm text-gray-500 mb-6">Записи о посещаемости, медицинских визитах и
                            пропусках</p>
                        <div className="grid grid-cols-1 gap-4">
                            {students?.Attendance?.map((record, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg hover:border-blue-200 transition-all duration-200"
                                >
                                    <div className="border-b border-gray-100 p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                        {/*<span className={`*/}
                        {/*  px-2 py-1 rounded-md text-xs font-medium*/}
                        {/*  ${record === 'medical' ? 'bg-blue-50 text-blue-700' :*/}
                        {/*    record.type === 'late' ? 'bg-yellow-50 text-yellow-700' :*/}
                        {/*        record.type === 'excused' ? 'bg-gray-50 text-gray-700' :*/}
                        {/*            record.type === 'absence' ? 'bg-red-50 text-red-700' :*/}
                        {/*                'bg-green-50 text-green-700'}*/}
                        {/*`}>*/}
                        {/*  {getAttendanceTypeText(record.type)}*/}
                        {/*</span>*/}
                                                <h3 className="text-sm font-medium text-gray-900">
                                                    {record.lesson.name && `Предмет: ${record.lesson.name}`}
                                                </h3>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-900">{record.date}</div>
                                                {record.studentId && (
                                                    <div className="text-xs text-gray-500">{record.studentId}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-b-lg">
                                        <div className="grid grid-cols-2 gap-4">
                                            {record.status && (
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Статус</span>
                                                    <p className="mt-1 text-gray-900">{record.status}</p>
                                                </div>
                                            )}
                                            {record.studentId && (
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Подтверждено</span>
                                                    <p className="mt-1 text-gray-900">{record.studentId}</p>
                                                </div>
                                            )}
                                            {record.studentId && (
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Длительность</span>
                                                    <p className="mt-1 text-gray-900">{record.studentId}</p>
                                                </div>
                                            )}
                                            {record.studentId && (
                                                <div className="text-sm col-span-2">
                                                    <span className="text-gray-500">Комментарий</span>
                                                    <p className="mt-1 text-gray-900 italic">{record.studentId}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Статистика посещаемости */}
                    <div className="bg-white rounded-xl p-6">
                        <h2 className="text-xl font-medium text-gray-900 mb-1">Статистика посещаемости</h2>
                        <p className="text-sm text-gray-500 mb-6">Общая статистика и показатели посещаемости</p>
                        <div className="grid grid-cols-4 gap-4 mb-8">
                            <div
                                className="p-4 rounded-lg border border-gray-100 hover:border-green-200 transition-all duration-200">
                                <div
                                    className="text-2xl font-semibold text-green-600">{attendanceStats.total.present}%
                                </div>
                                <div className="text-sm text-gray-600 mt-1">Присутствие</div>
                            </div>
                            <div
                                className="p-4 rounded-lg border border-gray-100 hover:border-red-200 transition-all duration-200">
                                <div className="text-2xl font-semibold text-red-600">{attendanceStats.total.absent}%
                                </div>
                                <div className="text-sm text-gray-600 mt-1">Отсутствие</div>
                            </div>
                            <div
                                className="p-4 rounded-lg border border-gray-100 hover:border-yellow-200 transition-all duration-200">
                                <div className="text-2xl font-semibold text-yellow-600">{attendanceStats.total.late}%
                                </div>
                                <div className="text-sm text-gray-600 mt-1">Опоздания</div>
                            </div>
                            <div
                                className="p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-all duration-200">
                                <div className="text-2xl font-semibold text-blue-600">{attendanceStats.total.medical}%
                                </div>
                                <div className="text-sm text-gray-600 mt-1">Мед. пункт</div>
                            </div>
                        </div>

                        {/* График посещаемости по месяцам */}
                        <div className="mb-8">
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Динамика по месяцам</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={attendanceStats.byMonth}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                                    <XAxis dataKey="month" stroke="#6b7280"/>
                                    <YAxis domain={[0, 100]} stroke="#6b7280"/>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px'
                                        }}
                                    />
                                    <Legend/>
                                    <Bar dataKey="присутствие" fill="#10B981" radius={[4, 4, 0, 0]}/>
                                    <Bar dataKey="отсутствие" fill="#EF4444" radius={[4, 4, 0, 0]}/>
                                    <Bar dataKey="опоздания" fill="#F59E0B" radius={[4, 4, 0, 0]}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* График посещаемости по предметам */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Статистика по предметам</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={attendanceStats.bySubject} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                                    <XAxis type="number" domain={[0, 100]} stroke="#6b7280"/>
                                    <YAxis dataKey="subject" type="category" width={100} stroke="#6b7280"/>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px'
                                        }}
                                    />
                                    <Legend/>
                                    <Bar dataKey="присутствие" fill="#10B981" radius={[0, 4, 4, 0]}/>
                                    <Bar dataKey="отсутствие" fill="#EF4444" radius={[0, 4, 4, 0]}/>
                                    <Bar dataKey="опоздания" fill="#F59E0B" radius={[0, 4, 4, 0]}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'finance' && (
                <div className="space-y-4">
                    <div className="flex justify-end gap-4 mb-6">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            onClick={() => setIsPaymentModalOpen(true)}
                        >
                            <FaFileInvoiceDollar className="w-4 h-4"/>
                            Назначить оплату
                        </button>
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            onClick={() => {/* Добавить логику */
                            }}
                        >
                            <FaCreditCard className="w-4 h-4"/>
                            Принять оплату
                        </button>
                    </div>

                    {isPaymentModalOpen && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg w-full max-w-lg">
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-lg font-medium text-gray-900">Назначить оплату</h2>
                                    <button
                                        onClick={() => setIsPaymentModalOpen(false)}
                                        className="text-gray-400 hover:text-gray-500 transition-colors"
                                    >
                                        <FaTimes className="w-5 h-5"/>
                                    </button>
                                </div>
                                <form onSubmit={handlePaymentSubmit} className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Тип оплаты
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={paymentFormData.type}
                                                onChange={(e) => setPaymentFormData({
                                                    ...paymentFormData,
                                                    type: e.target.value,
                                                    description: paymentTypes.find(t => t.id === e.target.value)?.label || ''
                                                })}
                                                required
                                            >
                                                <option value="">Выберите тип оплаты</option>
                                                {paymentTypes.map((type) => (
                                                    <option key={type.id} value={type.id}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Сумма (₸)
                                            </label>
                                            <input
                                                type="number"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={paymentFormData.amount}
                                                onChange={(e) => setPaymentFormData({
                                                    ...paymentFormData,
                                                    amount: Number(e.target.value)
                                                })}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Срок оплаты
                                            </label>
                                            <input
                                                type="date"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={paymentFormData.dueDate}
                                                onChange={(e) => setPaymentFormData({
                                                    ...paymentFormData,
                                                    dueDate: e.target.value
                                                })}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Скидка (%)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={paymentFormData.discount}
                                                onChange={(e) => setPaymentFormData({
                                                    ...paymentFormData,
                                                    discount: Number(e.target.value)
                                                })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Описание
                                            </label>
                                            <textarea
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={paymentFormData.description}
                                                onChange={(e) => setPaymentFormData({
                                                    ...paymentFormData,
                                                    description: e.target.value
                                                })}
                                                rows={3}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4 mt-6">
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                            onClick={() => setIsPaymentModalOpen(false)}
                                        >
                                            Отмена
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Назначить
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-medium text-gray-900">Финансовая сводка</h2>
                            <p className="text-sm text-gray-500">Общая информация по платежам</p>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-green-600">
                                            <FaMoneyBillWave className="w-8 h-8"/>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-green-600">
                                                {financialSummary.totalPaid.toLocaleString()} ₸
                                            </div>
                                            <div className="text-sm text-green-600">Всего оплачено</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-yellow-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-yellow-600">
                                            <FaFileInvoiceDollar className="w-8 h-8"/>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-yellow-600">
                                                {financialSummary.pendingPayments.toLocaleString()} ₸
                                            </div>
                                            <div className="text-sm text-yellow-600">Ожидает оплаты</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-blue-600">
                                            <FaHistory className="w-8 h-8"/>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {financialSummary.totalDiscount.toLocaleString()} ₸
                                            </div>
                                            <div className="text-sm text-blue-600">Сумма скидок</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-red-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-red-600">
                                            <FaMoneyBillWave className="w-8 h-8"/>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-red-600">
                                                {financialSummary.totalPenalty.toLocaleString()} ₸
                                            </div>
                                            <div className="text-sm text-red-600">Сумма пени</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-base font-medium text-gray-900 mb-4">Тренды платежей</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={paymentTrends}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                                        <XAxis dataKey="month" stroke="#6b7280"/>
                                        <YAxis stroke="#6b7280"/>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '6px'
                                            }}
                                        />
                                        <Legend/>
                                        <Line
                                            type="monotone"
                                            dataKey="сумма"
                                            stroke="#10B981"
                                            strokeWidth={2}
                                            dot={{r: 4}}
                                            activeDot={{r: 6}}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="скидка"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            dot={{r: 4}}
                                            activeDot={{r: 6}}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div>
                                <h3 className="text-base font-medium text-gray-900 mb-4">История платежей</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                        <tr>
                                            <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Тип
                                            </th>
                                            <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Сумма
                                            </th>
                                            <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Дата
                                            </th>
                                            <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Срок
                                            </th>
                                            <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Статус
                                            </th>
                                            <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Скидка
                                            </th>
                                            <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Пеня
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {payments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900">{payment.id}</td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm text-gray-900">{payment.description}</div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {payment.amount.toLocaleString()} ₸
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{payment.date}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{payment.dueDate}</td>
                                                <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                payment.status === 'оплачено'
                                    ? 'bg-green-100 text-green-800'
                                    : payment.status === 'не оплачено'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                            }`}>
                              {payment.status}
                            </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {payment.discount ? `${payment.discount}%` : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {payment.penalty ? `${payment.penalty} ₸` : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'schedule' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-medium text-gray-900">Расписание занятий</h2>
                                <p className="text-sm text-gray-500">Расписание занятий на текущую неделю</p>
                            </div>
                            <div className="flex gap-4">
                                <select
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                    value={dateFilter.type}
                                    onChange={(e) => setDateFilter({
                                        ...dateFilter,
                                        type: e.target.value as IDateFilter['type']
                                    })}
                                >
                                    <option value="day">День</option>
                                    <option value="week">Неделя</option>
                                    <option value="month">Месяц</option>
                                    <option value="quarter">Четверть</option>
                                </select>
                                <select
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                    value={dateFilter.value}
                                    onChange={(e) => setDateFilter({...dateFilter, value: e.target.value})}
                                >
                                    {dateFilter.type === 'day' && (
                                        <>
                                            <option value="current">Сегодня</option>
                                            <option value="next">Завтра</option>
                                        </>
                                    )}
                                    {dateFilter.type === 'week' && (
                                        <>
                                            <option value="current">Текущая неделя</option>
                                            <option value="next">Следующая неделя</option>
                                        </>
                                    )}
                                    {dateFilter.type === 'month' && (
                                        <>
                                            <option value="current">Текущий месяц</option>
                                            <option value="next">Следующий месяц</option>
                                        </>
                                    )}
                                    {dateFilter.type === 'quarter' && (
                                        <>
                                            <option value="1">1-я четверть</option>
                                            <option value="2">2-я четверть</option>
                                            <option value="3">3-я четверть</option>
                                            <option value="4">4-я четверть</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-6 gap-4">
                            <div className="col-span-1 space-y-4">
                                <div className="text-sm font-medium text-gray-500">Понедельник</div>
                                <div className="text-sm font-medium text-gray-500">Вторник</div>
                                <div className="text-sm font-medium text-gray-500">Среда</div>
                                <div className="text-sm font-medium text-gray-500">Четверг</div>
                                <div className="text-sm font-medium text-gray-500">Пятница</div>
                                <div className="text-sm font-medium text-gray-500">Saturday</div>
                            </div>

                            <div className="col-span-5 space-y-4">
                                {schedule.map((day) => (
                                    <div key={day.date} className="grid grid-cols-1 gap-2">
                                        {day.lessons.map((lesson) => (
                                            <div
                                                key={lesson.id}
                                                className={`p-3 rounded-lg ${
                                                    lesson.type === 'lecture' ? 'bg-pink-50' :
                                                        lesson.type === 'practice' ? 'bg-blue-50' :
                                                            lesson.type === 'lab' ? 'bg-green-50' : 'bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium">{lesson.time}</span>
                                                        <span
                                                            className="text-xs text-gray-500">({lesson.duration})</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">Кабинет {lesson.room}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-sm font-medium">{lesson.subject}</div>
                                                        <div className="text-xs text-gray-500">{lesson.teacher}</div>
                                                    </div>
                                                    <div className={`px-2 py-1 rounded-full text-xs ${
                                                        lesson.type === 'lecture' ? 'bg-pink-100 text-pink-800' :
                                                            lesson.type === 'practice' ? 'bg-blue-100 text-blue-800' :
                                                                lesson.type === 'lab' ? 'bg-green-100 text-green-800' : ''
                                                    }`}>
                                                        {getTypeText(lesson.type)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'exams' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="space-y-4">
                                <h2 className="text-xl font-medium text-gray-900">Экзамены и результаты</h2>
                                <div className="flex items-center gap-4">
                                    <select
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                        value={examFilter.year}
                                        onChange={(e) => setExamFilter({...examFilter, year: e.target.value})}
                                    >
                                        <option value="2024/2025">2024/2025</option>
                                        <option value="2023/2024">2023/2024</option>
                                    </select>

                                    <select
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                        value={examFilter.quarter}
                                        onChange={(e) => setExamFilter({...examFilter, quarter: e.target.value})}
                                    >
                                        <option value="all">Все четверти</option>
                                        <option value="1">1-я четверть</option>
                                        <option value="2">2-я четверть</option>
                                        <option value="3">3-я четверть</option>
                                        <option value="4">4-я четверть</option>
                                    </select>

                                    <select
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                        value={examFilter.month}
                                        onChange={(e) => setExamFilter({...examFilter, month: e.target.value})}
                                    >
                                        <option value="all">Все месяцы</option>
                                        <option value="1">Январь</option>
                                        <option value="2">Февраль</option>
                                        <option value="3">Март</option>
                                        <option value="4">Апрель</option>
                                        <option value="5">Май</option>
                                        <option value="6">Июнь</option>
                                        <option value="7">Июль</option>
                                        <option value="8">Август</option>
                                        <option value="9">Сентябрь</option>
                                        <option value="10">Октябрь</option>
                                        <option value="11">Ноябрь</option>
                                        <option value="12">Декабрь</option>
                                    </select>

                                    <select
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                        value={examFilter.examType}
                                        onChange={(e) => setExamFilter({...examFilter, examType: e.target.value})}
                                    >
                                        <option value="all">Все типы экзаменов</option>
                                        {examTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={exportToPDF}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <FaDownload className="w-4 h-4"/>
                                    Скачать PDF
                                </button>
                                <div className="text-right">
                                    <div className="text-sm text-gray-500">Общий рейтинг</div>
                                    <div className="text-2xl font-bold text-gray-900">{examSummary.ranking}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-500">Процент</div>
                                    <div className="text-2xl font-bold text-blue-600">{examSummary.percentage}%</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-500">Результат</div>
                                    <div className="text-2xl font-bold text-green-600">Сдано</div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="text-sm font-medium text-gray-500 mb-2">
                                {examFilter.examType === 'all' ? 'Все экзамены' : examTypes.find(t => t.id === examFilter.examType)?.label}
                                {examFilter.quarter !== 'all' && ` - ${examFilter.quarter}-я четверть`}
                                {examFilter.month !== 'all' && ` - ${new Date(2024, parseInt(examFilter.month) - 1).toLocaleString('ru', {month: 'long'})}`}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                    <tr>
                                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Предмет
                                        </th>
                                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Макс. баллы
                                        </th>
                                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Мин. баллы
                                        </th>
                                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Получено баллов
                                        </th>
                                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Результат
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredExams.map((exam, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() => setSelectedExam(exam)}
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {exam.subject} ({exam.code})
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-gray-900">{exam.maxScore}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-gray-900">{exam.minScore}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-gray-900">{exam.score}</div>
                                            </td>
                                            <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              exam.result === 'Сдано'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                          }`}>
                            {exam.result}
                          </span>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50 font-medium">
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            Рейтинг: {filteredExamSummary.ranking}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            Всего: {filteredExamSummary.maxPossibleScore}
                                        </td>
                                        <td className="px-4 py-3"></td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            Получено баллов: {filteredExamSummary.totalScore}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-blue-600">
                                            Процент: {filteredExamSummary.percentage.toFixed(2)}%
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="text-sm text-gray-500 mb-1">Всего экзаменов</div>
                                <div className="text-2xl font-bold text-gray-900">{filteredExamSummary.totalExams}</div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="text-sm text-gray-500 mb-1">Сдано</div>
                                <div className="text-2xl font-bold text-green-600">{filteredExamSummary.passed}</div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="text-sm text-gray-500 mb-1">Не сдано</div>
                                <div className="text-2xl font-bold text-red-600">{filteredExamSummary.failed}</div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="text-sm text-gray-500 mb-1">Средний балл</div>
                                <div
                                    className="text-2xl font-bold text-blue-600">{filteredExamSummary.averageScore.toFixed(1)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Модальное окно с деталями экзамена */}
                    {selectedExam && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        {selectedExam.subject} ({selectedExam.code})
                                    </h2>
                                    <button
                                        onClick={() => setSelectedExam(null)}
                                        className="text-gray-400 hover:text-gray-500 transition-colors"
                                    >
                                        <FaTimes className="w-5 h-5"/>
                                    </button>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Тип экзамена</div>
                                            <div className="text-base font-medium">{selectedExam.examType}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Дата</div>
                                            <div className="text-base font-medium">{selectedExam.date}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Экзаменатор</div>
                                            <div
                                                className="text-base font-medium">{selectedExam.details?.examiner}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Длительность</div>
                                            <div
                                                className="text-base font-medium">{selectedExam.details?.duration}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Место проведения</div>
                                            <div
                                                className="text-base font-medium">{selectedExam.details?.location}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Результат</div>
                                            <div className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                                                selectedExam.result === 'Сдано'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {selectedExam.result}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-base font-medium mb-4">Результаты по разделам</h3>
                                        <div className="space-y-4">
                                            {selectedExam.details?.topics.map((topic, index) => (
                                                <div key={index} className="border border-gray-100 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="text-sm font-medium">{topic.name}</div>
                                                        <div className="text-sm">
                                                            {topic.score} / {topic.maxScore} баллов
                                                            <span className="text-xs text-gray-500 ml-2">
                                ({((topic.score / topic.maxScore) * 100).toFixed(1)}%)
                              </span>
                                                        </div>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{width: `${(topic.score / topic.maxScore) * 100}%`}}
                                                        ></div>
                                                    </div>
                                                    {topic.mistakes && topic.mistakes.length > 0 && (
                                                        <div className="mt-2">
                                                            <div className="text-xs text-red-600 mb-1">Ошибки:</div>
                                                            <ul className="list-disc list-inside text-xs text-gray-600">
                                                                {topic.mistakes.map((mistake, idx) => (
                                                                    <li key={idx}>{mistake}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedExam.details?.notes && (
                                        <div>
                                            <h3 className="text-base font-medium mb-2">Примечания</h3>
                                            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                                                {selectedExam.details.notes}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'extracurricular' && (
                <div className="space-y-6">
                    {/* Секция с активными занятиями */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-medium text-gray-900 mb-1">Дополнительное образование</h2>
                        <p className="text-sm text-gray-500 mb-6">Кружки, секции и другие активности</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {extracurricularActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="bg-white border border-gray-200 rounded-lg hover:border-blue-200 transition-all duration-200"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-3 rounded-lg ${getActivityTypeColor(activity.type)}`}>
                                                    {getActivityTypeIcon(activity.type)}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">{activity.name}</h3>
                                                    <p className="text-sm text-gray-500">{activity.teacher}</p>
                                                </div>
                                            </div>
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${getActivityStatusColor(activity.status)}`}>
                        {getActivityStatusText(activity.status)}
                      </span>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-4">{activity.description}</p>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Расписание</div>
                                                <div className="text-sm text-gray-900">{activity.schedule}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Место</div>
                                                <div className="text-sm text-gray-900">{activity.location}</div>
                                            </div>
                                            {activity.members && (
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-1">Участников</div>
                                                    <div className="text-sm text-gray-900">{activity.members}</div>
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Дата начала</div>
                                                <div className="text-sm text-gray-900">{activity.startDate}</div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="text-xs text-gray-500 mb-2">Развиваемые навыки</div>
                                            <div className="flex flex-wrap gap-2">
                                                {activity.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                                                    >
                            {skill}
                          </span>
                                                ))}
                                            </div>
                                        </div>

                                        {activity.achievements && activity.achievements.length > 0 && (
                                            <div>
                                                <div className="text-xs text-gray-500 mb-2">Достижения</div>
                                                <div className="space-y-2">
                                                    {activity.achievements.map((achievement) => (
                                                        <div
                                                            key={achievement.id}
                                                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                                                        >
                                                            <div className={`p-2 rounded-lg ${
                                                                achievement.typeAchievement === 'competition' ? 'bg-purple-100 text-purple-600' :
                                                                    achievement.typeAchievement === 'certificate' ? 'bg-green-100 text-green-600' :
                                                                        'bg-orange-100 text-orange-600'
                                                            }`}>
                                                                {achievement.typeAchievement === 'competition' ?
                                                                    <FaAward className="w-4 h-4"/> :
                                                                    achievement.typeAchievement === 'certificate' ?
                                                                        <FaCertificate className="w-4 h-4"/> :
                                                                        <FaMedal className="w-4 h-4"/>}
                                                            </div>
                                                            <div>
                                                                <div
                                                                    className="text-sm font-medium text-gray-900">{achievement.title}</div>
                                                                <div
                                                                    className="text-xs text-gray-500">{achievement.description}</div>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span
                                                                        className="text-xs text-gray-500">{achievement.date}</span>
                                                                    {achievement.place && (
                                                                        <span
                                                                            className="text-xs font-medium text-blue-600">
                                      {achievement.place}
                                    </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Статистика и графики */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Распределение активностей</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            {
                                                name: 'Кружки',
                                                value: extracurricularActivities.filter(a => a.type === 'club').length
                                            },
                                            {
                                                name: 'Организации',
                                                value: extracurricularActivities.filter(a => a.type === 'organization').length
                                            },
                                            {
                                                name: 'Курсы',
                                                value: extracurricularActivities.filter(a => a.type === 'course').length
                                            },
                                            {
                                                name: 'Олимпиады',
                                                value: extracurricularActivities.filter(a => a.type === 'olympiad').length
                                            }
                                        ]}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                    >
                                        {extracurricularActivities.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                    <Legend/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Развитие навыков</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={[
                                    {
                                        subject: 'Технические',
                                        value: 80
                                    },
                                    {
                                        subject: 'Творческие',
                                        value: 65
                                    },
                                    {
                                        subject: 'Лидерские',
                                        value: 90
                                    },
                                    {
                                        subject: 'Академические',
                                        value: 85
                                    },
                                    {
                                        subject: 'Социальные',
                                        value: 75
                                    }
                                ]}>
                                    <PolarGrid/>
                                    <PolarAngleAxis dataKey="subject"/>
                                    <PolarRadiusAxis angle={30} domain={[0, 100]}/>
                                    <Radar name="Навыки" dataKey="value" stroke="#8884d8" fill="#8884d8"
                                           fillOpacity={0.6}/>
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDetailPage; 