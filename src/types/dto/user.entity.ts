
import {Role} from './enums'
import {Token} from './token.entity'
import {Student} from './student.entity'
import {Teacher} from './teacher.entity'
import {Admin} from './admin.entity'
import {Parent} from './parent.entity'


export interface User {
  id: number ;
username: string ;
passwordHash: string ;
createdAt: Date ;
updatedAt: Date ;
role: Role ;
token?: Token  | null;
student?: Student  | null;
teacher?: Teacher  | null;
admin?: Admin  | null;
parent?: Parent  | null;
}
