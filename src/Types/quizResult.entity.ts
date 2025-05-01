
import {Quiz} from './quiz.entity'
import {Student} from './student.entity'
import {Question} from './question.entity'
import {Answer} from './answer.entity'


export interface QuizResult {
  id: number ;
quizId: number ;
quiz?: Quiz ;
studentId: number ;
student?: Student ;
score: number ;
createdAt: Date ;
updatedAt: Date ;
Question?: Question  | null;
questionId: number  | null;
Answer?: Answer[] ;
}
