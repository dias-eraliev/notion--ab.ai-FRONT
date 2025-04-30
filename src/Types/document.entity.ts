
import {DocumentType} from './enums'
import {Attendance} from './attendance.entity'
import {Classroom} from './classroom.entity'


export interface Document {
  id: number ;
name: string ;
url: string ;
type: DocumentType ;
createdAt: Date ;
updatedAt: Date ;
Attendance?: Attendance[] ;
classrooms?: Classroom[] ;
}
