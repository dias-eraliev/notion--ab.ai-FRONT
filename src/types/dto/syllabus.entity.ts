
import {Teacher} from './teacher.entity'
import {Group} from './group.entity'
import {Student} from './student.entity'
import {Lesson} from './lesson.entity'
import {Material} from './material.entity'


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
materials?: Material[] ;
createdAt: Date ;
updatedAt: Date ;
}
