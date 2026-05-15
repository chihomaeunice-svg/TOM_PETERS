import { Router } from 'express';
import { authAdmin, db } from '../config/firebase';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { FieldValue } from 'firebase-admin/firestore';

const router = Router();

// Admin creates a seller account after approving inquiry
router.post(
  '/create-seller',
  authenticate,
  requireRole('admin'),
  async (req: AuthRequest, res) => {
    const { email, displayName, businessName, inquiryId } = req.body;

    if (!email || !displayName || !businessName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Generate a temp password
      const tempPassword = `TomPeters${Math.random().toString(36).slice(-8)}!`;

      const userRecord = await authAdmin.createUser({
        email,
        password: tempPassword,
        displayName,
      });

      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email,
        displayName,
        businessName,
        role: 'seller',
        status: 'active',
        createdAt: FieldValue.serverTimestamp(),
        subscriptionStatus: 'none',
      });

      // Update inquiry status
      if (inquiryId) {
        await db.collection('sellerInquiries').doc(inquiryId).update({
          status: 'approved',
          sellerUid: userRecord.uid,
          reviewedAt: FieldValue.serverTimestamp(),
          reviewedBy: req.uid,
        });
      }

      res.json({ success: true, uid: userRecord.uid, tempPassword });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get current user profile
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  const snap = await db.collection('users').doc(req.uid!).get();
  if (!snap.exists) return res.status(404).json({ error: 'Not found' });
  res.json(snap.data());
});

export default router;
