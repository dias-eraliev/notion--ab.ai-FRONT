



export interface InventoryObjectDto {
  id: number ;
createdAt: Date ;
updatedAt: Date ;
name: string ;
description: string ;
price: number ;
quantity: number ;
imageUrl: string  | null;
isAvailable: boolean ;
}
