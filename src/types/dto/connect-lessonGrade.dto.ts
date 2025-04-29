


export interface LessonGradeStudentIdLessonIdUniqueInputDto {
    studentId: number ;
lessonId: number ;
  }


export interface ConnectLessonGradeDto {
  id?: number ;
studentId_lessonId?: LessonGradeStudentIdLessonIdUniqueInputDto ;
}
