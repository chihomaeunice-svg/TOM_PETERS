import { Router } from 'express';
import { db } from '../config/firebase';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { FieldValue } from 'firebase-admin/firestore';

const router = Router();

// Get all active products (public)
router.get('/', async (req, res) => {
  const { category, limit = '20' } = req.query;
  let query = db.collection('products').where('isActive', '==', true);
  if (category) query = query.where('category', '==', category) as any;
  const snap = await (query as any).limit(parseInt(String(limit))).get();
  res.json(snap.docs.map((d: any) => ({ id: d.id, ...d.data() })));
});

// Get limited drops (public)
router.get('/drops', async (_req, res) => {
  const snap = await db
    .collection('products')
    .where('isLimitedDrop', '==', true)
    .where('isActive', '==', true)
    .get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  const snap = await db.collection('products').doc(req.params.id).get();
  if (!snap.exists) return res.status(404).json({ error: 'Product not found' });
  res.json({ id: snap.id, ...snap.data() });
});

// Create product (seller/admin only)
router.post('/', authenticate, requireRole('seller', 'admin'), async (req: AuthRequest, res) => {
  const { name, description, price, images, category, sizes, isLimitedDrop, tags } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sellerDoc = await db.collection('users').doc(req.uid!).get();
  const sellerData = sellerDoc.data();

  const ref = await db.collection('products').add({
    name,
    description: description || '',
    price: parseFloat(price),
    images: images || [],
    category,
    sizes: sizes || {},
    sellerId: req.uid,
    sellerName: sellerData?.businessName || sellerData?.displayName,
    isLimitedDrop: isLimitedDrop || false,
    isActive: true,
    tags: tags || [],
    createdAt: FieldValue.serverTimestamp(),
  });

  res.status(201).json({ id: ref.id });
});

// Update product (seller/admin only)
router.put('/:id', authenticate, requireRole('seller', 'admin'), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const snap = await db.collection('products').doc(id).get();
  if (!snap.exists) return res.status(404).json({ error: 'Not found' });

  const product = snap.data()!;
  if (req.role === 'seller' && product.sellerId !== req.uid) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const allowed = ['name', 'description', 'price', 'images', 'sizes', 'isActive', 'isLimitedDrop', 'tags', 'category'];
  const update: Record<string, any> = {};
  allowed.forEach(key => { if (req.body[key] !== undefined) update[key] = req.body[key]; });

  await db.collection('products').doc(id).update(update);
  res.json({ success: true });
});

// Delete product (seller/admin only)
router.delete('/:id', authenticate, requireRole('seller', 'admin'), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const snap = await db.collection('products').doc(id).get();
  if (!snap.exists) return res.status(404).json({ error: 'Not found' });

  const product = snap.data()!;
  if (req.role === 'seller' && product.sellerId !== req.uid) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await db.collection('products').doc(id).delete();
  res.json({ success: true });
});

export default router;
