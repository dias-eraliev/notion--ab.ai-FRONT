
import {Inventory} from './inventory.entity'
import {Classroom} from './classroom.entity'


export interface InventoryObject {
  id: number ;
Inventory?: Inventory  | null;
inventoryId: number  | null;
createdAt: Date ;
updatedAt: Date ;
name: string ;
description: string ;
price: number ;
quantity: number ;
imageUrl: string  | null;
isAvailable: boolean ;
classroom?: Classroom  | null;
classroomId: number  | null;
}
