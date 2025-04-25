
import {PaymentDirection,PaymentStatus,PaymentType} from './enums'




export interface UpdatePaymentDto {
  amount?: string ;
paidAt?: Date  | null;
dueDate?: Date ;
status?: PaymentStatus ;
direction?: PaymentDirection ;
type?: PaymentType ;
}
