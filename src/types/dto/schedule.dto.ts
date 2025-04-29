



export interface ScheduleDto {
  id: number ;
day: string ;
startTime: string ;
endTime: string ;
type: string ;
repeat: string ;
comment: string  | null;
createdAt: Date ;
updatedAt: Date ;
}
