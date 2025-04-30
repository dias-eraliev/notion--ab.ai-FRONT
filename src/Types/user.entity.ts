
import {Role} from './enums'
import {Token} from './token.entity'
import {Upload} from './upload.entity'
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
uploads?: Upload[] ;
student?: Student  | null;
teacher?: Teacher  | null;
admin?: Admin  | null;
parent?: Parent  | null;
}
