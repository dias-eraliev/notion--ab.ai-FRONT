
import {DocumentType} from './enums'
import {Payment} from './payment.entity'


export interface PaymentDocument {
  id: string ;
type: DocumentType ;
url: string ;
createdAt: Date ;
paymentId: string ;
payment?: Payment ;
}
