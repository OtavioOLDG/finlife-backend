import { z } from "zod";

export const projectSchema = z.object({
    __typename: z.literal('Project').default('Project'),
    id: z.number(),
    ownerId: z.string().uuid()
})

export type Project = z.infer<typeof projectSchema>