
import {ConnectStudentDto} from './connect-student.dto'
import {ConnectLessonDto} from './connect-lesson.dto'

export interface UpdateLessonGradeStudentRelationInputDto {
    connect: ConnectStudentDto ;
  }
export interface UpdateLessonGradeLessonRelationInputDto {
    connect: ConnectLessonDto ;
  }


export interface UpdateLessonGradeDto {
  student?: UpdateLessonGradeStudentRelationInputDto ;
lesson?: UpdateLessonGradeLessonRelationInputDto ;
comment?: string  | null;
grade?: number ;
}
