import { z } from "zod";

export const organizationSchema = z.object({
    __typename: z.literal('Organization').default('Organization'),
    id: z.number(),
    ownerId: z.string().uuid()
})

export type Organizatio = z.infer<typeof organizationSchema>