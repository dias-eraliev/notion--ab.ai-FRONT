
import {CreateQuestionDto} from './create-question.dto'
import {ConnectQuestionDto} from './connect-question.dto'

export interface CreateAnswerQuestionRelationInputDto {
    create?: CreateQuestionDto ;
connect?: ConnectQuestionDto ;
  }


export interface CreateAnswerDto {
  answer: string ;
Question?: CreateAnswerQuestionRelationInputDto ;
}
