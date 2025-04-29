
import {User} from './user.entity'
import {Syllabus} from './syllabus.entity'
import {Classroom} from './classroom.entity'


export interface Teacher {
  id: number ;
userId: number ;
user?: User ;
name: string ;
surname: string ;
createdAt: Date ;
updatedAt: Date ;
Syllabus?: Syllabus[] ;
responsibleFor?: Classroom[] ;
}
