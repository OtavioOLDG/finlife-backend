import {
  createMongoAbility,
  AbilityBuilder
} from '@casl/ability';

import type {
  CreateAbility,
  MongoAbility
} from '@casl/ability';
import { permissions } from './permissions';
import type { User } from './models/user';
import { userSubject } from './subjects/user';
import { projectSubject } from './subjects/project';
import { organizationSubject } from './subjects/organization';
import { inviteSubject } from './subjects/invite';
import { z } from 'zod';

const appAbilitiesSchema = z.union([
  userSubject,
  projectSubject,
  userSubject,
  organizationSubject,
  inviteSubject,
  z.tuple([z.literal('manage'), z.literal('all')])
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User){ 
  const builder = new AbilityBuilder(createAppAbility)

  if(typeof permissions[user.role] !== 'function') {
    throw new Error(`Permission for ${user.role} not found`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType(subject){
      return subject.__typename
    }
  })

  return ability
}

