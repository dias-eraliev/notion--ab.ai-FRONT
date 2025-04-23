
import {User} from './user.entity'
import {Group} from './group.entity'
import {Syllabus} from './syllabus.entity'


export interface Teacher {
  id: number ;
userId: number ;
user?: User ;
name: string ;
surname: string ;
groups?: Group[] ;
createdAt: Date ;
updatedAt: Date ;
Syllabus?: Syllabus[] ;
}
