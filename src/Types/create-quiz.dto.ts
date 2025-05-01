
import {CreateQuestionDto} from './create-question.dto'

export interface CreateQuizQuestionsRelationInputDto {
    create: CreateQuestionDto[] ;
  }


export interface CreateQuizDto {
  name: string ;
description: string ;
startTime?: Date  | null;
endTime?: Date  | null;
questions?: CreateQuizQuestionsRelationInputDto ;
}
