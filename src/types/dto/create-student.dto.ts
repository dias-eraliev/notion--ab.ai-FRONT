
import {ConnectGroupDto} from './connect-group.dto'
import {ConnectParentDto} from './connect-parent.dto'
import {ConnectAttendanceDto} from './connect-attendance.dto'

export interface CreateStudentGroupRelationInputDto {
    connect: ConnectGroupDto ;
  }
export interface CreateStudentParentRelationInputDto {
    connect: ConnectParentDto[] ;
  }
export interface CreateStudentAttendanceRelationInputDto {
    connect: ConnectAttendanceDto[] ;
  }


export interface CreateStudentDto {
  name: string ;
surname: string ;
group: CreateStudentGroupRelationInputDto ;
Parent?: CreateStudentParentRelationInputDto ;
Attendance?: CreateStudentAttendanceRelationInputDto ;
courseNumber?: number  | null;
}
