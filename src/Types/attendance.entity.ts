
import {Student} from './student.entity'
import {Lesson} from './lesson.entity'
import {Status} from './enums'
import {Document} from './document.entity'


export interface Attendance {
  id: number ;
studentId: number ;
student?: Student ;
lesson?: Lesson  | null;
status: Status ;
date: Date ;
createdAt: Date ;
updatedAt: Date ;
comment: string  | null;
document?: Document[] ;
}
