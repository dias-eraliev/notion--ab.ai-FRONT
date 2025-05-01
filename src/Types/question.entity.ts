
import {Answer} from './answer.entity'
import {Quiz} from './quiz.entity'
import {QuizResult} from './quizResult.entity'


export interface Question {
  id: number ;
question: string ;
quizId: number ;
answers?: Answer[] ;
createdAt: Date ;
updatedAt: Date ;
Quiz?: Quiz ;
QuizResult?: QuizResult[] ;
}
