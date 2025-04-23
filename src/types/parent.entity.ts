
import {User} from './user.entity'
import {Relation} from './enums'
import {Student} from './student.entity'


export interface Parent {
  id: number ;
userId: number ;
user?: User ;
relation: Relation ;
children?: Student[] ;
createdAt: Date ;
updatedAt: Date ;
}
