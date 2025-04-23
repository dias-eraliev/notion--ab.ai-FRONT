
import {Material} from './material.entity'
import {Lesson} from './lesson.entity'
import {HomeworkGrade} from './homeworkGrade.entity'


export interface Homework {
  id: number ;
name: string ;
material?: Material  | null;
materialId: number  | null;
Lesson?: Lesson ;
lessonId: number ;
date: Date  | null;
description: string  | null;
deadline: Date  | null;
createdAt: Date ;
updatedAt: Date ;
homeworkGrade?: HomeworkGrade  | null;
}
