import {ILesson} from "@/Interfeces/Lesson.interface.ts";

export interface IDaySchedule {
    date: string;
    dayOfWeek: string;
    lessons: ILesson[];
}