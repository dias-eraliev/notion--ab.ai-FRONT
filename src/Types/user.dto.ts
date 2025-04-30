
import {Role} from './enums'


export interface UserDto {
  id: number ;
username: string ;
passwordHash: string ;
createdAt: Date ;
updatedAt: Date ;
role: Role ;
}
