import {
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
} from '@typegoose/typegoose';
import { compare, hash } from 'bcryptjs';

@index({ email: 1 })
@pre<User>('save', async function () {
  // Хешируем пароль если он новый или измененный
  if (!this.isModified('password')) {
    return;
  }

  this.password = await hash(this.password, 12);
})
@modelOptions({
  schemaOptions: {
    // Add createdAt and updatedAt fields
    timestamps: true,
  },
})
export class User {
  @prop()
  name: string;

  @prop({ unique: true, required: true })
  email: string;

  @prop({ required: true, minlength: 8, maxLength: 64, select: false })
  password: string;

  @prop({ default: 'user' })
  role: string;

  async comparePasswords(candidatePassword: string, hashedPassword: string) {
    return await compare(candidatePassword, hashedPassword);
  }
}

export const UserModel = getModelForClass(User);
