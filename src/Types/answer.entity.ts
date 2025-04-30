
import {Question} from './question.entity'


export interface Answer {
  id: number ;
answer: string ;
isCorrect: boolean ;
questionId: number ;
Question?: Question ;
createdAt: Date ;
updatedAt: Date ;
}
