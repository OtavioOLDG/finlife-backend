import { z } from 'zod'

export const memberSubject = z.tuple(
    [
        z.union([z.literal('delete'), z.literal('invite'), z.literal('manage'),z.literal('get'), z.literal('delete')]), 
        z.literal('Member')
    ]
)

export type MemberSubject = z.infer <typeof memberSubject>