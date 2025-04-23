
import {User} from './user.entity'


export interface Admin {
  id: number ;
userId: number ;
user?: User ;
createdAt: Date ;
updatedAt: Date ;
}
