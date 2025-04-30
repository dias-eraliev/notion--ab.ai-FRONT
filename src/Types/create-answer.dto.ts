
import {ConnectQuestionDto} from './connect-question.dto'

export interface CreateAnswerQuestionRelationInputDto {
    connect: ConnectQuestionDto ;
  }


export interface CreateAnswerDto {
  answer: string ;
Question: CreateAnswerQuestionRelationInputDto ;
}
