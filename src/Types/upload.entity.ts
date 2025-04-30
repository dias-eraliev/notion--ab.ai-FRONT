
import {User} from './user.entity'
import {Material} from './material.entity'


export interface Upload {
  id: number ;
url: string ;
size: number ;
type: string ;
user?: User  | null;
createdAt: Date ;
updatedAt: Date ;
material?: Material  | null;
userId: number  | null;
materialId: number  | null;
}
