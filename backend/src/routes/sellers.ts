import { Router } from 'express';
import { db, authAdmin } from '../config/firebase';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { FieldValue } from 'firebase-admin/firestore';

const router = Router();

// List all seller inquiries (admin only)
router.get('/inquiries', authenticate, requireRole('admin'), async (_req, res) => {
  const snap = await db
    .collection('sellerInquiries')
    .orderBy('submittedAt', 'desc')
    .get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

// Submit seller inquiry (public)
router.post('/inquiries', async (req, res) => {
  const { name, email, phone, businessName, businessType, description } = req.body;
  if (!name || !email || !businessName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const ref = await db.collection('sellerInquiries').add({
    name,
    email,
    phone: phone || '',
    businessName,
    businessType: businessType || 'Other',
    description: description || '',
    status: 'pending',
    submittedAt: FieldValue.serverTimestamp(),
  });
  res.json({ id: ref.id, message: 'Application submitted successfully' });
});

// Approve or reject inquiry (admin only)
router.patch('/inquiries/:id', authenticate, requireRole('admin'), async (req: AuthRequest, res) => {
  const { status } = req.body;
  const { id } = req.params;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  await db.collection('sellerInquiries').doc(id).update({
    status,
    reviewedBy: req.uid,
    reviewedAt: FieldValue.serverTimestamp(),
  });
  res.json({ success: true });
});

// Get all sellers (admin only)
router.get('/', authenticate, requireRole('admin'), async (_req, res) => {
  const snap = await db
    .collection('users')
    .where('role', '==', 'seller')
    .get();
  res.json(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
});

// Suspend/activate a seller (admin only)
router.patch('/:uid/status', authenticate, requireRole('admin'), async (req, res) => {
  const { status } = req.body;
  const { uid } = req.params;
  if (!['active', 'suspended'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  await db.collection('users').doc(uid).update({ status });
  if (status === 'suspended') {
    await authAdmin.updateUser(uid, { disabled: true });
  } else {
    await authAdmin.updateUser(uid, { disabled: false });
  }
  res.json({ success: true });
});

export default router;
