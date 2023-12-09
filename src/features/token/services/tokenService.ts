// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import jwt from 'jsonwebtoken';
import config from 'config';

class TokenService {
  public generateTokens(payload: object) {
    const accessPrivateKey = Buffer.from(
      config.get<string>('accessTokenPrivateKey'),
      'base64',
    ).toString('ascii');

    const refreshPrivateKey = Buffer.from(
      config.get<string>('refreshTokenPrivateKey'),
      'base64',
    ).toString('ascii');

    return {
      accessToken: jwt.sign(payload, accessPrivateKey, {
        expiresIn: '15m',
        algorithm: 'RS256',
      }),
      refreshToken: jwt.sign(payload, refreshPrivateKey, {
        expiresIn: '30d',
        algorithm: 'RS256',
      }),
    };
  }

  public verifyAccessToken<T>(token: string): T | null {
    try {
      const publicKey = Buffer.from(
        config.get<string>('accessTokenPublicKey'),
        'base64',
      ).toString('ascii');

      return jwt.verify(token, publicKey) as T;
    } catch (error) {
      return null;
    }
  }

  public verifyRefreshToken<T>(token: string): T | null {
    try {
      const publicKey = Buffer.from(
        config.get<string>('refreshTokenPublicKey'),
        'base64',
      ).toString('ascii');

      return jwt.verify(token, publicKey) as T;
    } catch (error) {
      return null;
    }
  }
}

export const tokenService: TokenService = new TokenService();
