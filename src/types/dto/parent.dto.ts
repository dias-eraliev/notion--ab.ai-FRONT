
import {Relation} from './enums'


export interface ParentDto {
  id: number ;
name: string  | null;
surname: string  | null;
relation: Relation ;
createdAt: Date ;
updatedAt: Date ;
}
