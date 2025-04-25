
import {Classroom} from './classroom.entity'


export interface Schedule {
  id: number ;
day: string ;
startTime: string ;
endTime: string ;
classId: string ;
subject: string ;
teacherId: string ;
roomId: number ;
type: string ;
repeat: string ;
comment: string  | null;
createdAt: Date ;
updatedAt: Date ;
classroom?: Classroom ;
}
