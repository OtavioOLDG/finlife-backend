import { ability } from '@finlife/auth'

const userCanInviteSomeoneElse = ability.can('invite', 'User')
const userCanDeleteSomeoneElse = ability.can('delete', 'User')
const userCannnotDeleteSomeoneElse = ability.cannot('delete', 'User')
console.log(userCannnotDeleteSomeoneElse)
console.log(userCanInviteSomeoneElse + "\n" + userCanDeleteSomeoneElse + "\n" + userCannnotDeleteSomeoneElse)
console.log(userCannnotDeleteSomeoneElse)
console.log(userCannnotDeleteSomeoneElse)
console.log(userCannnotDeleteSomeoneElse)
