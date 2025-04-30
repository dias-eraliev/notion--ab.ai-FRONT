import React, {ReactNode, useEffect, useRef, useState} from "react"
import {CiCalendar, CiCircleCheck, CiWarning} from "react-icons/ci"
import {AiOutlineClockCircle} from "react-icons/ai"
import {FaUser} from "react-icons/fa"
import {useParams} from "react-router-dom"
import homeworkApi from "@/api/homework.api.ts"
import {useAuth} from "@/contexts/AuthContext.tsx"
import {uploadFile} from "@/api/uploadFiles.ts"
import {createHomeworkGrade} from "@/api/grades.api.ts"

type Homework = {
		id: number;
		name: string;
		materialId: number;
		lessonId: number;
		date: any;
		description: any;
		deadline: any;
		createdAt: string;
		updatedAt: string;
		Lesson: {
				id: number;
				name: string;
				description: string;
				syllabusId: number;
				materialId: any;
				attendanceId: number;
				date: any;
				createdAt: string;
				updatedAt: string;
				Syllabus: {
						id: number;
						name: string;
						description: string;
						teacherId: number;
						courseNumber: any;
						createdAt: string;
						updatedAt: string;
						group: Array<{
								id: number;
								name: string;
								courseNumber: number;
								createdAt: string;
								updatedAt: string;
						}>;
						teacher: {
								id: number;
								name: string;
								surname: string;
						};
				};
		};
		material: {
				id: number;
				name: string;
				videoUrl: any;
				lecture: any;
				presentationUrl: any;
				lessonId: any;
				createdAt: string;
				updatedAt: string;
				quizId: number;
				Quiz: {
						id: number;
						name: string;
						description: string;
						createdAt: string;
						updatedAt: string;
						quizUrl: string;
						questions: Array<{
								id: number;
								question: string;
								quizId: number;
								createdAt: string;
								updatedAt: string;
								answers: Array<{
										id: number;
										answer: string;
										questionId: number;
										createdAt: string;
										updatedAt: string;
								}>;
						}>;
				};
		};
};
const mockHomework: Homework = {
		id: 1,
		name: "Домашка по алгебре",
		materialId: 1,
		lessonId: 1,
		date: new Date(),
		description: "Сделать упр. 1-5 из учебника",
		deadline: new Date(),
		createdAt: "",
		updatedAt: "",
		Lesson: {
				id: 1,
				name: "Урок 1",
				description: "Производные",
				syllabusId: 1,
				materialId: null,
				attendanceId: 1,
				date: new Date(),
				createdAt: "",
				updatedAt: "",
				Syllabus: {
						id: 1,
						name: "Алгебра",
						description: "",
						teacherId: 1,
						courseNumber: null,
						createdAt: "",
						updatedAt: "",
						group: [{id: 1, name: "10-А", courseNumber: 10, createdAt: "", updatedAt: ""}],
						teacher: {
								id: 1,
								name: "Иван",
								surname: "Иванов",
						},
				},
		},
		material: {
				id: 1,
				name: "Введение",
				videoUrl: "https://www.youtube.com/watch?v=xvFZjo5PgG0",
				lecture: null,
				presentationUrl: "https://www.youtube.com/watch?v=xvFZjo5PgG0",
				lessonId: 1,
				createdAt: "",
				updatedAt: "",
				quizId: 1,
				Quiz: {
						id: 1,
						name: "Тест 1",
						description: "Проверь себя",
						createdAt: "",
						updatedAt: "",
						quizUrl: "https://www.youtube.com/watch?v=xvFZjo5PgG0",
						questions: [],
				},
		},
}
type Submission = {
		id: number;
		studentName: string;
		submissionDate: string;
		fileUrl: string;
		grade: number | null;
};
const mockSubmissions: Submission[] = [
		{
				id: 1,
				studentName: "Пётр Сидоров",
				submissionDate: new Date().toISOString(),
				fileUrl: "https://file.url/homework1.pdf",
				grade: null,
		},
		{
				id: 2,
				studentName: "Анна Петрова",
				submissionDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // вчера
				fileUrl: "https://file.url/homework2.pdf",
				grade: 4,
		},
		{
				id: 3,
				studentName: "Максим Кузнецов",
				submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // позавчера
				fileUrl: "https://file.url/homework3.pdf",
				grade: 5,
		},
];
type UserRole = "student" | "teacher"

interface InfoItemProps {
		icon: ReactNode
		label: string
		value: string | number
}

const InfoItem = ({icon, label, value}: InfoItemProps) => (
	<div className="flex items-center mb-3">
			<div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3`}>
					{icon}
			</div>
			<div>
					<div className="text-sm text-gray-600">{label}</div>
					<div className="font-medium">{value}</div>
			</div>
	</div>
)

interface ResourceCardProps {
		title: string
		label: string
		onClick: () => void
}

const ResourceCard = ({title, label, onClick}: ResourceCardProps) => (
	<div className="card">
			<div className="card-body p-4">
					<h4 className="card-title text-base">{title}</h4>
					<button type="button" className="btn btn-sm btn-outline mt-1 p-2" onClick={onClick}>
							{label}
					</button>
			</div>
	</div>
)

const HomeworkAbout: React.FC = () => {
		const { id } = useParams();
		const {payload} = useAuth();
		const userRole: UserRole = payload ? payload?.role.toLowerCase() as UserRole : "student";

		const [title, setTitle] = useState<Homework | null>(null);
		const [homework] = useState<Homework | null>(mockHomework);
		const [submissions] = useState<Submission[]>(mockSubmissions);
		const [file, setFile] = useState<File | null>(null);
		const [comment, setComment] = useState("");
		const [loading, setLoading] = useState(false);
		const [success, setSuccess] = useState(false);
		const [showSubmissions, setShowSubmissions] = useState(false);
		const fileInputRef = useRef<HTMLInputElement>(null);

		useEffect(() => {
				homeworkApi.getOne(Number(id)).then(data => {
						setTitle(data);
				});
		}, [id]);

		if (!homework) {
				return <div>Загрузка...</div>;
		}

		const formatDate = (d: string) =>
			new Date(d).toLocaleDateString("ru-RU", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
			});

		const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
				if (e.target.files?.[0]) setFile(e.target.files[0]);
		};

		const handleSubmit = async (e: React.MouseEvent) => {
				e.preventDefault();
				if (!file) return;
				setLoading(true);

				try {
						await uploadFile(file);
						setSuccess(true);
				} catch (err) {
						console.error("Ошибка при отправке решения:", err);
				} finally {
						setLoading(false);
						setFile(null);
						setComment("");
						if (fileInputRef.current) fileInputRef.current.value = "";
						setTimeout(() => setSuccess(false), 3000);
				}
		};

		const handleGrade = async (submission: Submission) => {
				const input = prompt("Введите оценку от 0 до 100");
				if (input === null) return; // пользователь отменил
				const grade = Number(input.trim());
				if (isNaN(grade) || grade < 0 || grade > 100) {
						alert("Неверное значение. Введите число от 0 до 100.");
						return;
				}

				try {
						await createHomeworkGrade({
								studentId: id,
								lessonId: id,
								homeworkId: id,
								homeworkGrade: grade,
								lessonGrade: 0,
								lessonGradeComment: "",
								homeworkGradeComment: "",
								isAbsent: false,
								absenceReason: "",
						});
						alert("Оценка отправлена");
				} catch (err) {
						console.error(err);
						alert("Ошибка при отправке оценки");
				}
		};
		return (
			<div className="p-6 max-w-[1600px] mx-auto">
					{/* шапка */}
					<div className="bg-white p-6 rounded-2xl shadow-md mb-6 flex justify-between items-center">
							<div>
									<h1 className="text-2xl font-bold">{title}</h1>
									<div className="text-sm text-gray-500 mt-1">
											{homework.Lesson?.Syllabus.name} • {homework.Lesson?.name} •{" "}
											{homework.Lesson?.Syllabus.group[0]?.name}
									</div>
									<div className="text-sm text-gray-500">
											Преподаватель: {homework.Lesson?.Syllabus.teacher.name}{" "}
											{homework.Lesson?.Syllabus.teacher.surname}
									</div>
							</div>
							<span className="inline-block bg-blue-100 text-blue-700 py-1 px-3 rounded-full font-medium">
          До {formatDate(homework.deadline as string)}
        </span>
					</div>

					<div className="flex flex-col lg:flex-row gap-6">
							<div className="flex-1 space-y-6">
									{/* описание */}
									<div className="bg-white p-6 rounded-2xl shadow-md">
											<h2 className="text-xl font-semibold mb-4">Описание</h2>
											<p className="text-gray-700">{homework.description}</p>
									</div>

									{/* материалы */}
									<div className="bg-white p-6 rounded-2xl shadow-md">
											<h3 className="text-lg font-semibold mb-4">Материалы</h3>
											<div className="flex flex-wrap gap-6">
													{homework.material?.videoUrl && (
														<ResourceCard
															title="Видео урок"
															label="Смотреть"
															onClick={() => window.open(homework.material?.videoUrl, "_blank")}
														/>
													)}
													{homework.material?.presentationUrl && (
														<ResourceCard
															title="Презентация"
															label="Открыть"
															onClick={() => window.open(homework.material?.presentationUrl, "_blank")}
														/>
													)}
													{homework.material?.Quiz && (
														<ResourceCard
															title={homework.material?.Quiz.name}
															label="Пройти тест"
															onClick={() => window.open(homework.material?.Quiz.quizUrl, "_blank")}
														/>
													)}
											</div>
									</div>

									{/* форма или решения */}
									{userRole === "student" && (
										<div className="mt-8 bg-base-200 p-6 rounded-lg shadow">
												<h3 className="text-lg font-bold mb-4">Отправить решение</h3>
												<div className="form-control mb-4">
														<label className="label">
																<span className="label-text">Прикрепить файл</span>
														</label>
														<input
															ref={fileInputRef}
															type="file"
															className="file-input file-input-bordered w-full p-1"
															onChange={handleFileChange}
														/>
												</div>
												<div className="form-control mb-4">
														<label className="label">
																<span className="label-text">Комментарий (необязательно)</span>
														</label>
														<textarea
															className="textarea textarea-bordered h-24"
															value={comment}
															onChange={(e) => setComment(e.target.value)}
															placeholder="Дополнительный комментарий к решению"
														/>
												</div>
												<button
													onClick={handleSubmit}
													className="btn btn-primary w-full"
													disabled={!file || loading}
												>
														{loading ? "Отправка..." : "Отправить решение"}
												</button>
												{success && (
													<div className="alert alert-success mt-4">
															<CiCircleCheck className="w-6 h-6" />
															<span>Решение успешно отправлено!</span>
													</div>
												)}
										</div>
									)}

									{userRole === "teacher" && (
										<div className="pl-1">
												<button
													className="btn btn-primary"
													onClick={() => setShowSubmissions((v) => !v)}
												>
														{showSubmissions ? "Скрыть решения" : "Просмотр решений"}
												</button>
										</div>
									)}
									{userRole === "teacher" && showSubmissions && (
										<div className="bg-white p-6 rounded-lg shadow-xs mt-6 flex-1">
												<h3 className="text-lg font-bold mb-4">Отправленные решения</h3>
												<table className="table table-zebra w-full">
														<thead>
														<tr>
																<th>Студент</th>
																<th>Дата отправки</th>
																<th>Файл</th>
																<th>Оценка</th>
																<th>Действия</th>
														</tr>
														</thead>
														<tbody>
														{submissions.map((s) => (
															<tr key={s.id}>
																	<td>{s.studentName}</td>
																	<td>{formatDate(s.submissionDate)}</td>
																	<td>
																			<a
																				href={s.fileUrl}
																				className="link link-primary"
																				target="_blank"
																				rel="noreferrer"
																			>
																					Просмотр
																			</a>
																	</td>
																	<td>{s.grade ?? "Не оценено"}</td>
																	<td>
																			<button className="btn btn-sm" onClick={() => handleGrade(s)}>Оценить</button>
																	</td>
															</tr>
														))}
														</tbody>
												</table>
										</div>
									)}
							</div>

							<div className="w-full lg:w-1/3">
									<div className="bg-white p-6 rounded-2xl shadow-md sticky top-6">
											<h3 className="text-lg font-semibold mb-4">Информация</h3>
											<InfoItem
												icon={<CiCalendar />}
												label="Дата выдачи"
												value={formatDate(homework.date as string)}
											/>
											<InfoItem
												icon={<AiOutlineClockCircle />}
												label="Срок сдачи"
												value={formatDate(homework.deadline as string)}
											/>
											<InfoItem
												icon={<FaUser />}
												label="Преподаватель"
												value={`${homework.Lesson?.Syllabus.teacher.name} ${homework.Lesson?.Syllabus.teacher.surname}`}
											/>
											{userRole === "student" && (
												<div className="mt-4 flex items-center text-yellow-700 bg-yellow-100 p-3 rounded">
														<CiWarning className="w-5 h-5 mr-2" />
														<span>Не выполнено</span>
												</div>
											)}
									</div>
							</div>
					</div>
			</div>
		);
};

export default HomeworkAbout;