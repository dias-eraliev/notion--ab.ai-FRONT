
import {Syllabus} from './syllabus.entity'
import {Lesson} from './lesson.entity'
import {Quiz} from './quiz.entity'
import {Homework} from './homework.entity'


export interface Material {
  id: number ;
name: string ;
videoUrl: string  | null;
lecture: string  | null;
presentationUrl: string  | null;
Syllabus?: Syllabus  | null;
syllabusId: number  | null;
Lesson?: Lesson  | null;
lessonId: number  | null;
createdAt: Date ;
updatedAt: Date ;
quizId: number  | null;
Quiz?: Quiz  | null;
Homework?: Homework  | null;
}
