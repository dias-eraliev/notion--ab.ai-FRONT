
import {Lesson} from './lesson.entity'
import {Classroom} from './classroom.entity'
import {Group} from './group.entity'


export interface Schedule {
  id: number ;
day: string ;
startTime: string ;
endTime: string ;
type: string ;
repeat: string ;
comment: string  | null;
createdAt: Date ;
updatedAt: Date ;
lesson?: Lesson  | null;
lessonId: number  | null;
classroom: Classroom ;
classroomId: number ;
Group?: Group ;
groupId: number ;
}
