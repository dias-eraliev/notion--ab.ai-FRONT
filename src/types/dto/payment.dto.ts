
import {PaymentDirection,PaymentStatus,PaymentType} from './enums'


export interface PaymentDto {
  id: string ;
amount: string ;
discount: string ;
paidAt: Date  | null;
dueDate: Date ;
status: PaymentStatus ;
direction: PaymentDirection ;
type: PaymentType ;
createdAt: Date ;
updatedAt: Date ;
}
