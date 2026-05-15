import { Router } from 'express';
import { db } from '../config/firebase';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { FieldValue } from 'firebase-admin/firestore';

const router = Router();

// Create order (customer)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  const { items, shippingAddress, total, sellerId } = req.body;
  if (!items?.length || !shippingAddress || !total) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const userDoc = await db.collection('users').doc(req.uid!).get();
  const userData = userDoc.data();

  const ref = await db.collection('orders').add({
    customerId: req.uid,
    customerEmail: userData?.email,
    customerName: userData?.displayName,
    items,
    total: parseFloat(total),
    status: 'pending',
    shippingAddress,
    sellerId: sellerId || items[0]?.sellerId,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  res.status(201).json({ id: ref.id });
});

// Get customer's own orders
router.get('/my', authenticate, async (req: AuthRequest, res) => {
  const snap = await db
    .collection('orders')
    .where('customerId', '==', req.uid)
    .orderBy('createdAt', 'desc')
    .get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

// Get seller's orders (seller/admin)
router.get('/seller', authenticate, requireRole('seller', 'admin'), async (req: AuthRequest, res) => {
  const uid = req.role === 'admin' ? req.query.sellerId as string : req.uid!;
  const snap = await db
    .collection('orders')
    .where('sellerId', '==', uid)
    .orderBy('createdAt', 'desc')
    .get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

// Get all orders (admin only)
router.get('/', authenticate, requireRole('admin'), async (_req, res) => {
  const snap = await db.collection('orders').orderBy('createdAt', 'desc').limit(100).get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

// Update order status (seller/admin)
router.patch('/:id/status', authenticate, requireRole('seller', 'admin'), async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  await db.collection('orders').doc(req.params.id).update({
    status,
    updatedAt: FieldValue.serverTimestamp(),
  });
  res.json({ success: true });
});

export default router;
