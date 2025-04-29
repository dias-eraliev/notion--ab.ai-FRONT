
import {Student} from './student.entity'
import {Homework} from './homework.entity'


export interface HomeworkGrade {
  id: number ;
student?: Student ;
studentId: number ;
homework?: Homework ;
homeworkId: number ;
comment: string  | null;
grade: number ;
createdAt: Date ;
updatedAt: Date ;
}
