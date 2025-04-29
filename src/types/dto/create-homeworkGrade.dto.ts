
import {ConnectStudentDto} from './connect-student.dto'
import {ConnectHomeworkDto} from './connect-homework.dto'

export interface CreateHomeworkGradeStudentRelationInputDto {
    connect: ConnectStudentDto ;
  }
export interface CreateHomeworkGradeHomeworkRelationInputDto {
    connect: ConnectHomeworkDto ;
  }


export interface CreateHomeworkGradeDto {
  student: CreateHomeworkGradeStudentRelationInputDto ;
homework: CreateHomeworkGradeHomeworkRelationInputDto ;
comment?: string  | null;
grade: number ;
}
