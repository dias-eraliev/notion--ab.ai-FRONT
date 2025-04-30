
import {ConnectLessonDto} from './connect-lesson.dto'
import {ConnectClassroomDto} from './connect-classroom.dto'
import {ConnectGroupDto} from './connect-group.dto'

export interface CreateScheduleLessonRelationInputDto {
    connect: ConnectLessonDto ;
  }
export interface CreateScheduleClassroomRelationInputDto {
    connect: ConnectClassroomDto ;
  }
export interface CreateScheduleGroupRelationInputDto {
    connect: ConnectGroupDto ;
  }


export interface CreateScheduleDto {
  day: string ;
startTime: string ;
endTime: string ;
type: string ;
repeat: string ;
comment?: string  | null;
lesson?: CreateScheduleLessonRelationInputDto ;
classroom: CreateScheduleClassroomRelationInputDto ;
Group: CreateScheduleGroupRelationInputDto ;
}
