
import {Teacher} from './teacher.entity'
import {Schedule} from './schedule.entity'
import {InventoryObject} from './inventoryObject.entity'
import {Document} from './document.entity'


export interface Classroom {
  id: number ;
name: string ;
isFree: boolean ;
type: string  | null;
capacity: number  | null;
responsibleStaffId: number  | null;
responsibleStaff?: Teacher  | null;
schedule?: Schedule[] ;
equipment?: InventoryObject[] ;
documents?: Document[] ;
createdAt: Date ;
updatedAt: Date ;
}
