
import {CreateAnswerDto} from './create-answer.dto'

export interface CreateQuestionAnswersRelationInputDto {
    create: CreateAnswerDto[] ;
  }


export interface CreateQuestionDto {
  question: string ;
answers?: CreateQuestionAnswersRelationInputDto ;
}
