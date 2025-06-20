import { z } from 'zod'

export const conviteSubject = z.tuple(
    [
        z.union([z.literal('create'), z.literal('delete'), z.literal('manage'),z.literal('get'),z.literal('getAll')]), 
        z.literal('Convite')
    ]
)

export type ConviteSubject = z.infer <typeof conviteSubject>