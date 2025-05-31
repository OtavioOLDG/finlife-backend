import { defineAbilityFor } from '@finlife/auth'

const ability = defineAbilityFor({role : 'ADMIN'})

const userCanInviteSomeoneElse = ability.can('invite', 'User')
const userCanDeleteSomeoneElse = ability.can('delete', 'User')
const userCannnotDeleteSomeoneElse = ability.cannot('delete', 'User')
console.log(userCanInviteSomeoneElse)
console.log(userCanDeleteSomeoneElse)
console.log(userCannnotDeleteSomeoneElse)
