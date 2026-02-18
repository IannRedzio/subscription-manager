import { UserRepository } from '../repositories/user.repository.js';
import { OAuthRepository } from '../repositories/oauth.repository.js';
import { OAuthLoginDTO } from '../models/OAuthAccount.js';
import { User } from '../models/User.js';
import { ValidationError, UnauthorizedError } from '../utils/errors.js';

const userRepository = new UserRepository();
const oauthRepository = new OAuthRepository();

export const oauthLogin = async (data: OAuthLoginDTO): Promise<User> => {
  if (!data.email) {
    throw new ValidationError('Email is required');
  }

  if (!data.provider || !data.providerAccountId) {
    throw new ValidationError('OAuth provider information is required');
  }

  let user = await userRepository.findByEmail(data.email);

  if (!user) {
    user = await userRepository.create({
      email: data.email,
      name: data.name ?? null,
      avatar: data.avatar ?? null,
      role: 'USER',
    });
  }

  const oauthAccount = await oauthRepository.findByProviderAccountId(
    data.provider,
    data.providerAccountId
  );

  if (!oauthAccount) {
    await oauthRepository.create({
      userId: user.id,
      provider: data.provider,
      providerAccountId: data.providerAccountId,
      accessToken: data.accessToken ?? null,
      refreshToken: data.refreshToken ?? null,
      expiresAt: data.expiresAt ?? null,
    });
  } else {
    await oauthRepository.update(oauthAccount.id, {
      accessToken: data.accessToken ?? null,
      refreshToken: data.refreshToken ?? null,
      expiresAt: data.expiresAt ?? null,
    });
  }

  return user;
};

export const getMe = async (user: User | undefined): Promise<User> => {
  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
};
