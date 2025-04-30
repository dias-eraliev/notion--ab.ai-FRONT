
import {CreateMaterialDto} from './create-material.dto'
import {ConnectLessonDto} from './connect-lesson.dto'

export interface CreateHomeworkMaterialRelationInputDto {
    create: CreateMaterialDto ;
  }
export interface CreateHomeworkLessonRelationInputDto {
    connect: ConnectLessonDto ;
  }


export interface CreateHomeworkDto {
  name: string ;
material?: CreateHomeworkMaterialRelationInputDto ;
Lesson: CreateHomeworkLessonRelationInputDto ;
date?: Date  | null;
description?: string  | null;
deadline?: Date  | null;
}
