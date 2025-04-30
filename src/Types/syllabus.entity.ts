
import {Teacher} from './teacher.entity'
import {Group} from './group.entity'
import {Student} from './student.entity'
import {Lesson} from './lesson.entity'


export interface Syllabus {
  id: number ;
name: string ;
description: string ;
teacher?: Teacher ;
teacherId: number ;
courseNumber: number  | null;
group?: Group[] ;
students?: Student[] ;
lessons?: Lesson[] ;
createdAt: Date ;
updatedAt: Date ;
}
