
import {ConnectStudentDto} from './connect-student.dto'
import {ConnectHomeworkDto} from './connect-homework.dto'

export interface UpdateHomeworkGradeStudentRelationInputDto {
    connect: ConnectStudentDto ;
  }
export interface UpdateHomeworkGradeHomeworkRelationInputDto {
    connect: ConnectHomeworkDto ;
  }


export interface UpdateHomeworkGradeDto {
  student?: UpdateHomeworkGradeStudentRelationInputDto ;
homework?: UpdateHomeworkGradeHomeworkRelationInputDto ;
comment?: string  | null;
grade?: number ;
}
