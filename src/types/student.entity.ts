
import {User} from './user.entity'
import {Group} from './group.entity'
import {Parent} from './parent.entity'
import {Attendance} from './attendance.entity'
import {LessonGrade} from './lessonGrade.entity'
import {HomeworkGrade} from './homeworkGrade.entity'
import {Syllabus} from './syllabus.entity'


export interface Student {
  id: number ;
userId: number ;
user?: User ;
name: string ;
surname: string ;
group?: Group ;
groupId: number ;
Parent?: Parent  | null;
parentId: number  | null;
Attendance?: Attendance[] ;
lessonGrades?: LessonGrade[] ;
homeworkGrades?: HomeworkGrade[] ;
createdAt: Date ;
updatedAt: Date ;
Syllabus?: Syllabus  | null;
syllabusId: number  | null;
courseNumber: number  | null;
}
