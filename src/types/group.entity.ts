
import {Student} from './student.entity'
import {Syllabus} from './syllabus.entity'
import {Teacher} from './teacher.entity'


export interface Group {
  id: number ;
name: string ;
students?: Student[] ;
Syllabus?: Syllabus  | null;
syllabusId: number  | null;
courseNumber: number  | null;
createdAt: Date ;
updatedAt: Date ;
Teacher?: Teacher  | null;
teacherId: number  | null;
}
