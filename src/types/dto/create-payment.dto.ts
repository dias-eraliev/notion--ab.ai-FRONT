
import {PaymentDirection,PaymentStatus,PaymentType} from './enums'




export interface CreatePaymentDto {
  amount: string ;
paidAt?: Date  | null;
dueDate: Date ;
status: PaymentStatus ;
direction: PaymentDirection ;
type: PaymentType ;
}
