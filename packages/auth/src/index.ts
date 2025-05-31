import { 
    createMongoAbility, 
    AbilityBuilder
} from '@casl/ability';

import type {
    ForcedSubject, 
    CreateAbility, 
    MongoAbility, 
} from '@casl/ability'
import { permissions } from './permissions';
import type { User } from './models/user';

const actions = ['manage', 'invite','delete', 'get'] as const;
const subjects = ['User', 'all'] as const;

type AppAbilities = [
  typeof actions[number],
  typeof subjects[number] | ForcedSubject<Exclude<typeof subjects[number], 'all'>>
];

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User){ 
  const builder = new AbilityBuilder(createAppAbility)

  if(typeof permissions[user.role] !== 'function') {
    throw new Error(`Permission for ${user.role} not found`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build()

  return ability
}

