import { z } from 'zod'

export const patrimonioSubject = z.tuple(
    [
        z.union([z.literal('delete'), z.literal('invite'), z.literal('manage'),z.literal('get'), z.literal('delete')]), 
        z.literal('Patrimonio')
    ]
)

export type PatrimonioSubject = z.infer <typeof patrimonioSubject>