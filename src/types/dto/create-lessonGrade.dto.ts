
import {ConnectStudentDto} from './connect-student.dto'
import {ConnectLessonDto} from './connect-lesson.dto'

export interface CreateLessonGradeStudentRelationInputDto {
    connect: ConnectStudentDto ;
  }
export interface CreateLessonGradeLessonRelationInputDto {
    connect: ConnectLessonDto ;
  }


export interface CreateLessonGradeDto {
  student: CreateLessonGradeStudentRelationInputDto ;
lesson: CreateLessonGradeLessonRelationInputDto ;
comment?: string  | null;
grade: number ;
}
