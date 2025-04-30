
import {Question} from './question.entity'
import {Material} from './material.entity'


export interface Quiz {
  id: number ;
name: string ;
description: string ;
questions?: Question[] ;
createdAt: Date ;
updatedAt: Date ;
Material?: Material[] ;
}
