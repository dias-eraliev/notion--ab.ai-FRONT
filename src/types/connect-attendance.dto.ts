


export interface AttendanceStudentIdLessonIdUniqueInputDto {
    studentId: number ;
lessonId: number ;
  }


export interface ConnectAttendanceDto {
  id?: number ;
studentId_lessonId?: AttendanceStudentIdLessonIdUniqueInputDto ;
}
