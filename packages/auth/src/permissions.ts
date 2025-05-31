import type { AbilityBuilder } from "@casl/ability"
import type { AppAbility } from "."
import type { User} from "./models/user"

type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void

type Roles = 'ADMIN' | 'MEMBER' | 'BILLING'

export const permissions: Record<Roles, PermissionsByRole> = {
    ADMIN(_, { can }) {
        can('manage', 'all')
    },
    MEMBER(_, { can }) {
        can('invite', 'User')
    },
    BILLING(_, {can}){
        can('get', 'User')
    }
}