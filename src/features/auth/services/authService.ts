import { BadRequestError, NotAuthorizedError } from '@app/shared';
import { DocumentType } from '@typegoose/typegoose';

import { User, UserModel } from '../../user';
import { tokenService } from '../../token';
import { AuthModel } from '../models';
import { AuthOutputDTO, SignInDTO, SignUpDTO } from '../dto';
import { AuthMapper } from '../mappers';

export class AuthService {
  /** Регистрация пользователя */
  public async signUp(data: SignUpDTO) {
    const candidate = await UserModel.findOne({ email: data.email });

    if (candidate) {
      throw new BadRequestError('Пользователь с таким email уже существует');
    }

    const createdUser = await UserModel.create(data);

    return this.getUserAuthData(createdUser);
  }

  /** Авторизация пользователя */
  public async signIn(data: SignInDTO) {
    const user = await UserModel.findOne({ email: data.email }).select(
      '+password',
    );

    if (!user || !(await user.comparePasswords(data.password, user.password))) {
      throw new BadRequestError('Некорректный email или пароль');
    }

    return this.getUserAuthData(user);
  }

  /** Логаут юзера */
  public async logout(refreshToken: string) {
    await AuthModel.deleteOne({ refreshToken });

    return;
  }

  /** Сохранение рефреш токена с привязкой к пользователю */
  private async saveToken(userId: string, refreshToken: string) {
    const tokenData = await AuthModel.findOne({ user: userId });

    if (tokenData) {
      await tokenData.deleteOne();
    }

    const token = await AuthModel.create({ user: userId, refreshToken });

    return Promise.resolve({ token });
  }

  /** Обновление токена */
  public async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new NotAuthorizedError();
    }

    //Если верификация токена пройдет успешно, вернется payload, в котором будет id пользователя
    const decoded = tokenService.verifyRefreshToken<{ id: string }>(
      refreshToken,
    );
    const tokenFromDb = AuthModel.findOne({ refreshToken });
    const user = await UserModel.findById(decoded?.id).exec();

    if (!decoded?.id || !tokenFromDb || !user) {
      throw new NotAuthorizedError();
    }

    return this.getUserAuthData(user);
  }

  public async getAllUsers() {
    return UserModel.find();
  }

  /** Получение авторизационные данные пользователя */
  private async getUserAuthData(
    user: DocumentType<User>,
  ): Promise<AuthOutputDTO> {
    const userDTO = AuthMapper.toAuthUserOutputDTO(user);

    const tokens = tokenService.generateTokens(userDTO);

    await this.saveToken(userDTO.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDTO,
    };
  }
}

export const authService: AuthService = new AuthService();
