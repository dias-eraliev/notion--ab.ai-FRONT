
import {User} from './user.entity'
import {Group} from './group.entity'
import {Parent} from './parent.entity'
import {Attendance} from './attendance.entity'
import {Syllabus} from './syllabus.entity'
import {Payment} from './payment.entity'
import {Grade} from './grade.entity'
import {QuizResult} from './quizResult.entity'


export interface Student {
  id: number ;
userId: number ;
user?: User ;
name: string ;
surname: string ;
group?: Group ;
groupId: number ;
Parent?: Parent[] ;
Attendance?: Attendance[] ;
createdAt: Date ;
updatedAt: Date ;
Syllabus?: Syllabus[] ;
courseNumber: number  | null;
payments?: Payment[] ;
grades?: Grade[] ;
QuizResult?: QuizResult[] ;
}
