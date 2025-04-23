
import {Student} from './student.entity'
import {Homework} from './homework.entity'


export interface HomeworkGrade {
  id: number ;
student?: Student ;
studentId: number ;
homework?: Homework ;
homeworkId: number ;
grade: number ;
createdAt: Date ;
updatedAt: Date ;
}
