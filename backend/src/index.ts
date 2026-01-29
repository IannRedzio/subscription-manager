import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import './config/passport';

import authRoutes from './routes/auth.routes.js';
import subscriptionRoutes from './routes/subscriptions.routes.js';
import categoryRoutes from './routes/categories.routes.js';
import userRoutes from './routes/users.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

app.use((_err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(_err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
