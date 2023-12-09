import { DocumentType } from '@typegoose/typegoose';

import { SignupInput } from '../schemas';
import { AuthUserOutputDTO, SignUpDTO } from '../dto';
import { User } from '../../user';

export class AuthMapper {
  public static toSignupDTO(data: SignupInput): SignUpDTO {
    return {
      email: data.email,
      name: data.name,
      password: data.password,
    };
  }

  public static toAuthUserOutputDTO(
    data: DocumentType<User>,
  ): AuthUserOutputDTO {
    return {
      id: data._id.toString(),
      email: data.email,
      name: data.name,
    };
  }
}
