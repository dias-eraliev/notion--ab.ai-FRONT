
import {Student} from './student.entity'
import {Syllabus} from './syllabus.entity'
import {Schedule} from './schedule.entity'


export interface Group {
  id: number ;
name: string ;
students?: Student[] ;
Syllabus?: Syllabus[] ;
courseNumber: number  | null;
createdAt: Date ;
updatedAt: Date ;
schedule?: Schedule[] ;
}
