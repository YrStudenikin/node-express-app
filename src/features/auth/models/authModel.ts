import { Ref, getModelForClass, prop } from '@typegoose/typegoose';

import { User } from '../../user';

export class Auth {
  @prop({ ref: () => User })
  user: Ref<User>;

  @prop({ required: true })
  refreshToken: string;
}

export const AuthModel = getModelForClass(Auth);
