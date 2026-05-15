import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import sellerRoutes from './routes/sellers';
import subscriptionRoutes from './routes/subscriptions';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

app.get('/health', (_req, res) =>
  res.json({ status: 'ok', brand: 'TOM PETERS', timestamp: new Date().toISOString() })
);

app.use(
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
);

app.listen(PORT, () => {
  console.log(`TOM PETERS API running on port ${PORT}`);
});

export default app;
