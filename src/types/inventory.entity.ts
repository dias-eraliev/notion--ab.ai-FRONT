
import {Object} from './object.entity'


export interface Inventory {
  id: number ;
name: string ;
description: string ;
objects?: Object[] ;
createdAt: Date ;
updatedAt: Date ;
}
