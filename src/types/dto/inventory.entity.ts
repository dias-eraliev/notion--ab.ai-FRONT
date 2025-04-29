
import {InventoryObject} from './inventoryObject.entity'


export interface Inventory {
  id: number ;
name: string ;
description: string ;
objects?: InventoryObject[] ;
createdAt: Date ;
updatedAt: Date ;
}
