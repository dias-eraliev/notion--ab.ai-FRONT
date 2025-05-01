
import {ConnectQuestionDto} from './connect-question.dto'

export interface UpdateAnswerQuestionRelationInputDto {
    connect: ConnectQuestionDto ;
  }


export interface UpdateAnswerDto {
  answer?: string ;
Question?: UpdateAnswerQuestionRelationInputDto ;
}
