
import {PaymentDirection,PaymentStatus,PaymentType} from './enums'
import {PaymentDocument} from './paymentDocument.entity'
import {Student} from './student.entity'


export interface Payment {
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
documents?: PaymentDocument[] ;
studentId: number  | null;
student?: Student  | null;
}
