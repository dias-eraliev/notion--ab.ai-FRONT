
import {Schedule} from './schedule.entity'


export interface Classroom {
  id: number ;
name: string ;
isFree: boolean ;
schedule?: Schedule[] ;
createdAt: Date ;
updatedAt: Date ;
}
