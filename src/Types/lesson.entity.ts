
import {Syllabus} from './syllabus.entity'
import {Homework} from './homework.entity'
import {Material} from './material.entity'
import {Attendance} from './attendance.entity'
import {Schedule} from './schedule.entity'
import {Grade} from './grade.entity'


export interface Lesson {
  id: number ;
name: string ;
description: string ;
Syllabus?: Syllabus ;
syllabusId: number ;
homework?: Homework  | null;
materials?: Material  | null;
materialId: number  | null;
Attendance?: Attendance  | null;
attendanceId: number  | null;
date: Date  | null;
createdAt: Date ;
updatedAt: Date ;
Schedule?: Schedule  | null;
Grade?: Grade  | null;
}
