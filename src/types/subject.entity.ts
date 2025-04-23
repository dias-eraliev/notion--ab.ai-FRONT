
import {Syllabus} from './syllabus.entity'
import {Teacher} from './teacher.entity'


export interface Subject {
  id: number ;
name: string ;
description: string ;
Syllabus?: Syllabus[] ;
Teacher?: Teacher[] ;
createdAt: Date ;
updatedAt: Date ;
}
