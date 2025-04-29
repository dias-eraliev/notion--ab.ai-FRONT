
import {CreateQuizDto} from './create-quiz.dto'

export interface CreateMaterialQuizRelationInputDto {
    create: CreateQuizDto ;
  }


export interface CreateMaterialDto {
  name: string ;
videoUrl?: string  | null;
lecture?: string  | null;
presentationUrl?: string  | null;
Quiz?: CreateMaterialQuizRelationInputDto ;
}
