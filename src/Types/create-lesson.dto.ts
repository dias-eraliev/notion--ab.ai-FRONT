
import {CreateMaterialDto} from './create-material.dto'

export interface CreateLessonMaterialsRelationInputDto {
    create: CreateMaterialDto ;
  }


export interface CreateLessonDto {
  name: string ;
description: string ;
materials?: CreateLessonMaterialsRelationInputDto ;
date?: Date  | null;
}
