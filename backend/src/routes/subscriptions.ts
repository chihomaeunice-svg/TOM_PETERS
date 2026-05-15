import { Router } from 'express';
import { db } from '../config/firebase';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { FieldValue } from 'firebase-admin/firestore';

const router = Router();

// Get active plans (public)
router.get('/', async (_req, res) => {
  const snap = await db.collection('subscriptions').where('isActive', '==', true).get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

// Create plan (admin only)
router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  const {
    name, price, billingCycle, features,
    productLimit, orderCommission,
    hasAnalytics, hasPrioritySupport,
  } = req.body;

  if (!name || !price || !billingCycle) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const ref = await db.collection('subscriptions').add({
    name,
    price: parseFloat(price),
    billingCycle,
    features: features || [],
    productLimit: parseInt(productLimit) || 50,
    orderCommission: parseFloat(orderCommission) || 0,
    hasAnalytics: hasAnalytics || false,
    hasPrioritySupport: hasPrioritySupport || false,
    isActive: true,
    createdAt: FieldValue.serverTimestamp(),
  });

  res.status(201).json({ id: ref.id });
});

// Update plan (admin only)
router.put('/:id', authenticate, requireRole('admin'), async (req, res) => {
  const allowed = [
    'name', 'price', 'billingCycle', 'features', 'productLimit',
    'orderCommission', 'hasAnalytics', 'hasPrioritySupport', 'isActive',
  ];
  const update: Record<string, any> = {};
  allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
  await db.collection('subscriptions').doc(req.params.id).update(update);
  res.json({ success: true });
});

// Assign subscription to seller (admin only)
router.post('/assign', authenticate, requireRole('admin'), async (req, res) => {
  const { sellerUid, planId } = req.body;
  const planSnap = await db.collection('subscriptions').doc(planId).get();
  if (!planSnap.exists) return res.status(404).json({ error: 'Plan not found' });

  await db.collection('users').doc(sellerUid).update({
    subscriptionId: planId,
    subscriptionStatus: 'active',
    subscriptionPlan: planSnap.data()?.name,
    subscriptionStartDate: FieldValue.serverTimestamp(),
  });

  res.json({ success: true });
});

export default router;
