import React, {ReactNode, useRef, useState} from "react"
import {CiCalendar, CiCircleCheck, CiWarning} from "react-icons/ci"
import {AiOutlineClockCircle} from "react-icons/ai"
import {FaUser} from "react-icons/fa"

type Homework = {
		id: number
		name: string
		materialId: number
		lessonId: number
		date: any
		description: any
		deadline: any
		createdAt: string
		updatedAt: string
		Lesson: {
				id: number
				name: string
				description: string
				syllabusId: number
				materialId: any
				attendanceId: number
				date: any
				createdAt: string
				updatedAt: string
				Syllabus: {
						id: number
						name: string
						description: string
						teacherId: number
						courseNumber: any
						createdAt: string
						updatedAt: string
						group: Array<{
								id: number
								name: string
								courseNumber: number
								createdAt: string
								updatedAt: string
						}>
						teacher: {
								id: number
								name: string
								surname: string
						}
				}
		}
		material: {
				id: number
				name: string
				videoUrl: any
				lecture: any
				presentationUrl: any
				lessonId: any
				createdAt: string
				updatedAt: string
				quizId: number
				Quiz: {
						id: number
						name: string
						description: string
						createdAt: string
						updatedAt: string
						quizUrl: string
						questions: Array<{
								id: number
								question: string
								quizId: number
								createdAt: string
								updatedAt: string
								answers: Array<{
										id: number
										answer: string
										questionId: number
										createdAt: string
										updatedAt: string
								}>
						}>
				}
		}
}

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

const mockSubmissions = [
		{
				id: 1,
				studentName: "Петр Сидоров",
				submissionDate: new Date(),
				fileUrl: "https://file.url/homework1.pdf",
				grade: null,
		},
		{
				id: 2,
				studentName: "Анна Петрова",
				submissionDate: new Date(Date.now() - 86400000),
				fileUrl: "https://file.url/homework2.pdf",
				grade: 4,
		},
		{
				id: 3,
				studentName: "Максим Кузнецов",
				submissionDate: new Date(Date.now() - 172800000),
				fileUrl: "https://file.url/homework3.pdf",
				grade: 5,
		},
]

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
		const [homework] = useState<Homework>(mockHomework)
		const [userRole] = useState<UserRole>("student") // роль тут менять
		const [file, setFile] = useState<File | null>(null)
		const fileInputRef = useRef<HTMLInputElement>(null)
		const [comment, setComment] = useState<string>("")
		const [loading, setLoading] = useState<boolean>(false)
		const [success, setSuccess] = useState<boolean>(false)

		const formatDate = (date: Date) =>
			new Date(date).toLocaleDateString("ru-RU", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
			})

		const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
				if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0])
		}

		const handleSubmit = (e: React.MouseEvent) => {
				e.preventDefault()
				setLoading(true)
				setTimeout(() => {
						setLoading(false)
						setSuccess(true)
						setFile(null)
						setComment("")
						if (fileInputRef.current) fileInputRef.current.value = ""
						setTimeout(() => setSuccess(false), 3000)
				}, 1500)
		}

		const renderSubmissionForm = () => (
			<div className="mt-8 bg-base-200 p-6 rounded-lg shadow">
					<h3 className="text-lg font-bold mb-4">Отправить решение</h3>
					<div>
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
							<div className="form-control mb-4 flex flex-col">
									<label className="label">
											<span className="label-text">Комментарий (необязательно)</span>
									</label>
									<textarea
										className="textarea textarea-bordered h-24"
										value={comment}
										onChange={(e) => setComment(e.target.value)}
										placeholder="Дополнительный комментарий к решению"
									></textarea>
							</div>
							<button onClick={handleSubmit} className="btn btn-primary w-full" disabled={!file || loading}>
									{loading ? "Отправка..." : "Отправить решение"}
							</button>
							{success && (
								<div className="alert alert-success mt-4">
										<CiCircleCheck className="w-6 h-6"/>
										<span>Решение успешно отправлено!</span>
								</div>
							)}
					</div>
			</div>
		)

		const renderSubmissionsTable = () => (
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
							{mockSubmissions.map((submission) => (
								<tr key={submission.id}>
										<td>{submission.studentName}</td>
										<td>{formatDate(submission.submissionDate)}</td>
										<td>
												<a
													href={submission.fileUrl}
													className="link link-primary"
													target="_blank"
													rel="noreferrer"
												>
														Просмотр
												</a>
										</td>
										<td>{submission.grade || "Не оценено"}</td>
										<td>
												<button className="btn btn-sm">Оценить</button>
										</td>
								</tr>
							))}
							</tbody>
					</table>
			</div>
		)

		return (
			<div className="p-6 max-w-[1600px] mx-auto">
					<div className="bg-white p-6 rounded-2xl shadow-md mb-6 flex justify-between items-center">
							<div>
									<h1 className="text-2xl font-bold">{homework.name}</h1>
									<div className="text-sm text-gray-500 mt-1">
											{homework.Lesson.Syllabus.name} • {homework.Lesson.name} • {homework.Lesson.Syllabus.group[0]?.name}
									</div>
									<div
										className="text-sm text-gray-500">Преподаватель: {homework.Lesson.Syllabus.teacher.name} {homework.Lesson.Syllabus.teacher.surname}</div>
							</div>
							<div>
          <span className="inline-block bg-blue-100 text-blue-700 py-1 px-3 rounded-full font-medium">
            До {formatDate(homework.deadline)}
          </span>
							</div>
					</div>

					<div className="flex flex-col lg:flex-row gap-6">
							<div className="flex-1 space-y-6">
									<div className="bg-white p-6 rounded-2xl shadow-md">
											<h2 className="text-xl font-semibold mb-4">Описание</h2>
											<p className="text-gray-700">{homework.description}</p>
									</div>

									<div className="bg-white p-6 rounded-2xl shadow-md">
											<h3 className="text-lg font-semibold mb-4">Материалы</h3>
											<div className="flex flex-wrap gap-6">
													{homework.material.videoUrl && (
														<ResourceCard title="Видео урок" label="Смотреть"
														              onClick={() => window.open(homework.material.videoUrl, "_blank")}/>
													)}
													{homework.material.presentationUrl && (
														<ResourceCard title="Презентация" label="Открыть"
														              onClick={() => window.open(homework.material.presentationUrl, "_blank")}/>
													)}
													{homework.material.Quiz && (
														<ResourceCard title={homework.material.Quiz.name} label="Пройти тест"
														              onClick={() => window.open(homework.material.Quiz.quizUrl, "_blank")}/>
													)}
											</div>
									</div>

									{userRole === "student" ? renderSubmissionForm() : renderSubmissionsTable()}
							</div>

							<div className="w-full lg:w-1/3">
									<div className="bg-white p-6 rounded-2xl shadow-md sticky top-6">
											<h3 className="text-lg font-semibold mb-4">Информация</h3>
											<InfoItem icon={<CiCalendar/>} label="Дата выдачи" value={formatDate(homework.date)}/>
											<InfoItem icon={<AiOutlineClockCircle/>} label="Срок сдачи"
											          value={formatDate(homework.deadline)}/>
											<InfoItem icon={<FaUser/>} label="Преподаватель"
											          value={`${homework.Lesson.Syllabus.teacher.name} ${homework.Lesson.Syllabus.teacher.surname}`}/>
											{userRole === "student" && (
												<div className="mt-4 flex items-center text-yellow-700 bg-yellow-100 p-3 rounded">
														<CiWarning className="w-5 h-5 mr-2"/>
														<span>Не выполнено</span>
												</div>
											)}
									</div>
							</div>
					</div>
			</div>
		)
}

export default HomeworkAbout
