
import {Question} from './question.entity'
import {Material} from './material.entity'
import {QuizResult} from './quizResult.entity'


export interface Quiz {
  id: number ;
name: string ;
description: string ;
startTime: Date  | null;
endTime: Date  | null;
questions?: Question[] ;
createdAt: Date ;
updatedAt: Date ;
Material?: Material[] ;
QuizResult?: QuizResult[] ;
}
