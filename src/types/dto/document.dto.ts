
import {DocumentType} from './enums'


export interface DocumentDto {
  id: number ;
name: string ;
url: string ;
type: DocumentType ;
createdAt: Date ;
updatedAt: Date ;
}
