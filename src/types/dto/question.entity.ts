
import {Answer} from './answer.entity'
import {Quiz} from './quiz.entity'


export interface Question {
  id: number ;
question: string ;
quizId: number ;
answers?: Answer[] ;
createdAt: Date ;
updatedAt: Date ;
Quiz?: Quiz ;
}
