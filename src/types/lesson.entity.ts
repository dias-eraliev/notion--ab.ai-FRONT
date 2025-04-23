
import {Syllabus} from './syllabus.entity'
import {Homework} from './homework.entity'
import {Material} from './material.entity'
import {Attendance} from './attendance.entity'
import {LessonGrade} from './lessonGrade.entity'


export interface Lesson {
  id: number ;
name: string ;
description: string ;
Syllabus?: Syllabus ;
syllabusId: number ;
homework?: Homework  | null;
materials?: Material  | null;
Attendance?: Attendance[] ;
lessonGrades?: LessonGrade[] ;
date: Date  | null;
createdAt: Date ;
updatedAt: Date ;
}
