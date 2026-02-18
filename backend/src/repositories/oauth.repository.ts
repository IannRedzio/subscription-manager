import { prisma } from '../config/database.js';
import { OAuthAccount, AuthProvider } from '../models/OAuthAccount.js';

export class OAuthRepository {
  async findByProviderAccountId(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<OAuthAccount | null> {
    return prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
    });
  }

  async create(data: {
    userId: string;
    provider: AuthProvider;
    providerAccountId: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    expiresAt?: Date | null;
  }): Promise<OAuthAccount> {
    return prisma.oAuthAccount.create({
      data: {
        userId: data.userId,
        provider: data.provider,
        providerAccountId: data.providerAccountId,
        accessToken: data.accessToken ?? null,
        refreshToken: data.refreshToken ?? null,
        expiresAt: data.expiresAt ?? null,
      },
    });
  }

  async update(
    id: string,
    data: {
      accessToken?: string | null;
      refreshToken?: string | null;
      expiresAt?: Date | null;
    }
  ): Promise<OAuthAccount> {
    return prisma.oAuthAccount.update({
      where: { id },
      data: {
        accessToken: data.accessToken ?? null,
        refreshToken: data.refreshToken ?? null,
        expiresAt: data.expiresAt ?? null,
      },
    });
  }
}
