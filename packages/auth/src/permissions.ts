import type { AbilityBuilder } from "@casl/ability"
import type { AppAbility } from "."
import type { User} from "./models/user"
import type { Role } from "./roles"

type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void

export const permissions: Record<Role, PermissionsByRole> = {
    ADMIN(user, { can, cannot }) {
        can('manage', 'all')
    },
    MEMBRO(user, { can, cannot}) {
        can('get', 'Convite')
        can('get', 'Member')
    },
    CONVIDADO(user, { can , cannot}){
        can('get', 'Convite')
    }
}