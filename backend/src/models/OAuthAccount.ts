// Value objects
export const authProviders = ['GOOGLE', 'GITHUB'] as const;
export type AuthProvider = (typeof authProviders)[number];

// Entity
export interface OAuthAccount {
  id: string;
  userId: string;
  provider: AuthProvider;
  providerAccountId: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  expiresAt?: Date | null;
  createdAt: Date;
}

// DTOs
export interface OAuthLoginDTO {
  provider: AuthProvider;
  providerAccountId: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  expiresAt?: Date | null;
}
