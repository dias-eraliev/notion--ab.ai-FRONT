
import {Lesson} from './lesson.entity'
import {Upload} from './upload.entity'
import {Quiz} from './quiz.entity'
import {Homework} from './homework.entity'


export interface Material {
  id: number ;
name: string ;
videoUrl: string  | null;
lecture: string  | null;
presentationUrl: string  | null;
Lesson?: Lesson  | null;
lessonId: number  | null;
createdAt: Date ;
updatedAt: Date ;
quizId: number  | null;
uploads?: Upload[] ;
Quiz?: Quiz  | null;
Homework?: Homework  | null;
}
