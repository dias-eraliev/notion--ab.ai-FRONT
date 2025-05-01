
import {Question} from './question.entity'
import {QuizResult} from './quizResult.entity'


export interface Answer {
  id: number ;
answer: string ;
isCorrect: boolean ;
questionId: number  | null;
Question?: Question  | null;
createdAt: Date ;
updatedAt: Date ;
QuizResult?: QuizResult  | null;
quizResultId: number  | null;
}
