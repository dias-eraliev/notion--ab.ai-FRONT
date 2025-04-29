


export interface GradeStudentIdLessonIdUniqueInputDto {
    studentId: number ;
lessonId: number ;
  }


export interface ConnectGradeDto {
  id?: number ;
lessonId?: number ;
homeworkId?: number ;
studentId_lessonId?: GradeStudentIdLessonIdUniqueInputDto ;
}
