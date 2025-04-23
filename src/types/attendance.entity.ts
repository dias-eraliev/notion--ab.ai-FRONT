
import {Student} from './student.entity'
import {Lesson} from './lesson.entity'
import {Status} from './enums'


export interface Attendance {
  id: number ;
studentId: number ;
student?: Student ;
lessonId: number ;
lesson?: Lesson ;
status: Status ;
date: Date ;
createdAt: Date ;
updatedAt: Date ;
}
