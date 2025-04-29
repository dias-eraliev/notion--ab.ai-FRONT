
import {ConnectLessonDto} from './connect-lesson.dto'
import {ConnectClassroomDto} from './connect-classroom.dto'
import {ConnectGroupDto} from './connect-group.dto'

export interface UpdateScheduleLessonRelationInputDto {
    connect: ConnectLessonDto ;
  }
export interface UpdateScheduleClassroomRelationInputDto {
    connect: ConnectClassroomDto ;
  }
export interface UpdateScheduleGroupRelationInputDto {
    connect: ConnectGroupDto ;
  }


export interface UpdateScheduleDto {
  day?: string ;
startTime?: string ;
endTime?: string ;
type?: string ;
repeat?: string ;
comment?: string  | null;
lesson?: UpdateScheduleLessonRelationInputDto ;
classroom?: UpdateScheduleClassroomRelationInputDto ;
Group?: UpdateScheduleGroupRelationInputDto ;
}
