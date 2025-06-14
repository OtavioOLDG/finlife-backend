import type { AbilityBuilder } from "@casl/ability"
import type { AppAbility } from "."
import type { User} from "./models/user"
import type { Role } from "./roles"

type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void

export const permissions: Record<Role, PermissionsByRole> = {
    ADMIN(_, { can, cannot }) {
        can('manage', 'all')
    },
    MEMBRO(_, { can, cannot}) {
        can('get', 'Convite')
    },
    CONVIDADO(_, { can , cannot}){
        can('get', 'Convite')
    }
}