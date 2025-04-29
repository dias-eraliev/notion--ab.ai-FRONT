
import {Student} from './student.entity'
import {Lesson} from './lesson.entity'
import {Homework} from './homework.entity'


export interface Grade {
  id: number ;
Student?: Student  | null;
studentId: number  | null;
lesson?: Lesson  | null;
lessonId: number  | null;
homeworkGradeComment: string  | null;
lessonGradeComment: string  | null;
averageGrade: number  | null;
lessonGrade: number  | null;
homeworkGrade: number  | null;
createdAt: Date ;
updatedAt: Date ;
Homework?: Homework  | null;
homeworkId: number  | null;
}
