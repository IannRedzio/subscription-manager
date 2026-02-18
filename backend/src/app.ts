import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import './config/passport.js';

import authRoutes from './routes/auth.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import categoryRoutes from './routes/category.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'Subscription Manager API' });
});

app.use(errorHandler);

export default app;
