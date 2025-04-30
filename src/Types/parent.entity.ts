
import {User} from './user.entity'
import {Relation} from './enums'
import {Student} from './student.entity'


export interface Parent {
  id: number ;
userId: number ;
name: string  | null;
surname: string  | null;
user?: User ;
relation: Relation ;
children?: Student[] ;
createdAt: Date ;
updatedAt: Date ;
}
