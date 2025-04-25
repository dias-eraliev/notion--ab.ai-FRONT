



export interface ScheduleDto {
  id: number ;
day: string ;
startTime: string ;
endTime: string ;
classId: string ;
subject: string ;
teacherId: string ;
type: string ;
repeat: string ;
comment: string  | null;
createdAt: Date ;
updatedAt: Date ;
}
