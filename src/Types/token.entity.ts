
import {User} from './user.entity'


export interface Token {
  id: number ;
token: string ;
userId: number ;
user?: User ;
createdAt: Date ;
expiresAt: Date ;
}
