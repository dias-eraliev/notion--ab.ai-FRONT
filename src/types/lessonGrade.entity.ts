
import {Student} from './student.entity'
import {Lesson} from './lesson.entity'


export interface LessonGrade {
  id: number ;
student?: Student ;
studentId: number ;
lesson?: Lesson ;
lessonId: number ;
grade: number ;
createdAt: Date ;
updatedAt: Date ;
}
