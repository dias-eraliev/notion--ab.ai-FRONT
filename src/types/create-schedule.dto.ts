





export interface CreateScheduleDto {
  day: string ;
startTime: string ;
endTime: string ;
classId: string ;
subject: string ;
teacherId: string ;
type: string ;
repeat: string ;
comment?: string  | null;
}
