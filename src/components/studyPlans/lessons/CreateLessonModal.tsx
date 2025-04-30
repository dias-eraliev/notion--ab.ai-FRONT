import { useState, forwardRef } from 'react';
import Modal from '@/ui/Modal';
import DatePicker, { setDefaultLocale, registerLocale } from "react-datepicker";
import { ru } from 'date-fns/locale';
import { format } from 'date-fns';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { createLesson } from '@/api/studyPlans';
import { FilePond } from 'react-filepond';

registerLocale('ru', ru);

export default function CreateLessonModal({
    studyPlanId,
    isOpen,
    onClose,
    mutate,
}: {
    studyPlanId: number;
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}) {
    const [startDate, setStartDate] = useState(new Date());
    const [presentationFiles, setPresentationFiles] = useState<any[]>([]);
    const [videoFiles, setVideoFiles] = useState<any[]>([]);
    const [presentationUrl, setPresentationUrl] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    // Функция для получения url после загрузки (пример для FilePond с сервером)
    const handlePresentationUpdate = (fileItems: any[]) => {
        setPresentationFiles(fileItems);
        if (fileItems[0]?.serverId) setPresentationUrl(fileItems[0].serverId);
    };
    const handleVideoUpdate = (fileItems: any[]) => {
        setVideoFiles(fileItems);
        if (fileItems[0]?.serverId) setVideoUrl(fileItems[0].serverId);
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Создать урок"
                size="md"
            >
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const data: any = {
                        name: formData.get('name'),
                        description: formData.get('description'),
                        date: startDate,
                    };
                    if (presentationUrl || videoUrl) {
                        data.materials = {
                            create: {
                                name: formData.get('name'),
                                presentationUrl: presentationUrl || undefined,
                                videoUrl: videoUrl || undefined,
                            }
                        }
                    }
                    const response = await createLesson(studyPlanId.toString(), data);
                    if (response) {
                        mutate();
                    }
                    onClose();
                }}>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">
                            Название урока
                        </legend>
                        <input
                            type="text"
                            placeholder="Название урока"
                            className="input w-full"
                            name="name"
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">
                            Описание урока
                        </legend>
                        <textarea
                            placeholder="Описание урока"
                            className="textarea min-h-24 w-full"
                            name="description"
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Дата урока</legend>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date as Date)}
                            locale={"ru"}
                            startDate={startDate}
                            nextMonthButtonLabel=">"
                            previousMonthButtonLabel="<"
                            popperClassName="react-datepicker-right"
                            customInput={<ButtonInput />}
                            renderCustomHeader={({
                                date,
                                decreaseMonth,
                                increaseMonth,
                                prevMonthButtonDisabled,
                                nextMonthButtonDisabled,
                            }) => (
                                <div className="flex items-center justify-between px-2 py-2">
                                    <span className="text-lg text-gray-700">
                                        {format(date, 'MMMM yyyy')}
                                    </span>

                                    <div className="space-x-2">
                                        <button
                                            onClick={decreaseMonth}
                                            disabled={prevMonthButtonDisabled}
                                            type="button"
                                            className={`
                                            ${prevMonthButtonDisabled && 'cursor-not-allowed opacity-50'}
                                            inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500
                                        `}
                                        >
                                            <FaChevronLeft className="w-5 h-5 text-gray-600" />
                                        </button>

                                        <button
                                            onClick={increaseMonth}
                                            disabled={nextMonthButtonDisabled}
                                            type="button"
                                            className={`
                                            ${nextMonthButtonDisabled && 'cursor-not-allowed opacity-50'}
                                            inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500
                                        `}
                                        >
                                            <FaChevronRight className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Презентация</legend>
                        <FilePond
                            files={presentationFiles}
                            onupdatefiles={handlePresentationUpdate}
                            allowMultiple={false}
                            name="presentation"
                            labelIdle="Перетащите или выберите презентацию (pdf, pptx)"
                            acceptedFileTypes={["application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]}
                            server={{
                                process: {
                                    url: '/api/upload', // Замените на ваш endpoint
                                    method: 'POST',
                                    withCredentials: false,
                                    onload: (res) => {
                                        // Вернуть url файла
                                        const { url } = JSON.parse(res);
                                        setPresentationUrl(url);
                                        return url;
                                    },
                                },
                                revert: null,
                            }}
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Видео</legend>
                        <FilePond
                            files={videoFiles}
                            onupdatefiles={handleVideoUpdate}
                            allowMultiple={false}
                            name="video"
                            labelIdle="Перетащите или выберите видео (mp4, mov)"
                            acceptedFileTypes={["video/mp4", "video/quicktime"]}
                            server={{
                                process: {
                                    url: '/api/upload', // Замените на ваш endpoint
                                    method: 'POST',
                                    withCredentials: false,
                                    onload: (res) => {
                                        const { url } = JSON.parse(res);
                                        setVideoUrl(url);
                                        return url;
                                    },
                                },
                                revert: null,
                            }}
                        />
                    </fieldset>
                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-4"
                    >
                        Создать
                    </button>
                </form>
            </Modal>
        </>
    );
}

const ButtonInput = forwardRef(({ value, onClick }, ref) => (
    <button
        onClick={onClick}
        ref={ref}
        type="button"
        className='input w-full'
    >
        {format(new Date(value), 'dd MMMM yyyy')}
    </button>
))