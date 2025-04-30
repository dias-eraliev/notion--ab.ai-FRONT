
import {ConnectLessonDto} from './connect-lesson.dto'

export interface UpdateHomeworkLessonRelationInputDto {
    connect: ConnectLessonDto ;
  }


export interface UpdateHomeworkDto {
  name?: string ;
Lesson?: UpdateHomeworkLessonRelationInputDto ;
date?: Date  | null;
description?: string  | null;
deadline?: Date  | null;
}
