


export interface HomeworkGradeStudentIdHomeworkIdUniqueInputDto {
    studentId: number ;
homeworkId: number ;
  }


export interface ConnectHomeworkGradeDto {
  id?: number ;
homeworkId?: number ;
studentId_homeworkId?: HomeworkGradeStudentIdHomeworkIdUniqueInputDto ;
}
