import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
    },
    async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email provided'), undefined);
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName || profile.name?.givenName,
              avatar: profile.photos?.[0]?.value,
              role: 'USER',
            },
          });
        }

        // Update or create OAuth account
        const oauthAccount = await prisma.oAuthAccount.findUnique({
          where: {
            provider_providerAccountId: {
              provider: 'GOOGLE',
              providerAccountId: profile.id,
            },
          },
        });

        if (!oauthAccount) {
          await prisma.oAuthAccount.create({
            data: {
              userId: user.id,
              provider: 'GOOGLE',
              providerAccountId: profile.id,
              accessToken: _accessToken,
              refreshToken: _refreshToken,
              expiresAt: _refreshToken ? new Date(Date.now() + 3600 * 1000) : null,
            },
          });
        } else {
          await prisma.oAuthAccount.update({
            where: { id: oauthAccount.id },
            data: {
              accessToken: _accessToken,
              refreshToken: _refreshToken,
              expiresAt: _refreshToken ? new Date(Date.now() + 3600 * 1000) : null,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/api/auth/github/callback',
      scope: ['user:email'],
    },
    async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
      try {
        let email = profile.emails?.[0]?.value;

        // Si el email no está en el perfil, obtenerlo de la API de GitHub
        if (!email) {
          console.log('Email not in profile, fetching from GitHub API...');
          const response = await fetch('https://api.github.com/user/emails', {
            headers: {
              Authorization: `Bearer ${_accessToken}`,
              'User-Agent': 'subscription-manager',
            },
          });
          const emails = await response.json() as Array<{ email: string; primary: boolean }>;
          console.log('GitHub emails response:', emails);
          const primaryEmail = emails.find((e) => e.primary) || emails[0];
          email = primaryEmail?.email;
        }

        if (!email) {
          return done(new Error('No email provided'), undefined);
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName || profile.username,
              avatar: profile.photos?.[0]?.value,
              role: 'USER',
            },
          });
        }

        // Update or create OAuth account
        const oauthAccount = await prisma.oAuthAccount.findUnique({
          where: {
            provider_providerAccountId: {
              provider: 'GITHUB',
              providerAccountId: profile.id,
            },
          },
        });

        if (!oauthAccount) {
          await prisma.oAuthAccount.create({
            data: {
              userId: user.id,
              provider: 'GITHUB',
              providerAccountId: profile.id,
              accessToken: _accessToken,
              refreshToken: _refreshToken,
            },
          });
        } else {
          await prisma.oAuthAccount.update({
            where: { id: oauthAccount.id },
            data: {
              accessToken: _accessToken,
              refreshToken: _refreshToken,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

export default passport;
