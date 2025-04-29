
import {DocumentType} from './enums'


export interface PaymentDocumentDto {
  id: string ;
type: DocumentType ;
url: string ;
createdAt: Date ;
}
