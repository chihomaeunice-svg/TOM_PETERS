import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getSellerInquiries, updateInquiryStatus, SellerInquiry } from '../../services/firestore';
import { UserProfile } from '../../services/auth';
import { useAuth } from '../../hooks/useAuth';
import { COLLECTIONS } from '../../utils/collections';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function AdminSellers() {
  const { profile } = useAuth();
  const [sellers, setSellers] = useState<UserProfile[]>([]);
  const [inquiries, setInquiries] = useState<SellerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'sellers' | 'applications'>('sellers');
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [sellersSnap, inqs] = await Promise.all([
      getDocs(query(collection(db, COLLECTIONS.USERS), where('role', '==', 'seller'))),
      getSellerInquiries(),
    ]);
    setSellers(sellersSnap.docs.map(d => d.data() as UserProfile));
    setInquiries(inqs);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleInquiry = async (id: string, status: 'approved' | 'rejected') => {
    if (!profile) return;
    setUpdating(id);
    await updateInquiryStatus(id, status, profile.uid);
    setUpdating(null);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-tp-charcoal mb-8">Sellers Management</h1>

      <div className="flex gap-2 mb-6">
        {(['sellers', 'applications'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm tracking-wider uppercase rounded transition-colors ${
              tab === t ? 'bg-tp-charcoal text-white' : 'border border-tp-border text-tp-taupe hover:border-tp-gold'
            }`}>
            {t === 'sellers' ? `Sellers (${sellers.length})` : `Applications (${inquiries.filter(i => i.status === 'pending').length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="animate-pulse bg-white rounded h-16" />)}</div>
      ) : tab === 'sellers' ? (
        <div className="bg-white border border-tp-border rounded overflow-hidden shadow-luxe">
          {sellers.length === 0 ? (
            <div className="text-center py-16 text-tp-taupe">No sellers yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-tp-silk border-b border-tp-border">
                <tr>
                  {['Name', 'Email', 'Business', 'Status', 'Plan'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs tracking-widest uppercase text-tp-taupe">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-tp-border">
                {sellers.map(s => (
                  <tr key={s.uid} className="hover:bg-tp-silk/30 transition-colors">
                    <td className="px-4 py-3 text-tp-charcoal">{s.displayName}</td>
                    <td className="px-4 py-3 text-tp-taupe">{s.email}</td>
                    <td className="px-4 py-3 text-tp-taupe">{s.businessName || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                        s.status === 'active' ? 'bg-tp-success/10 text-tp-success' :
                        s.status === 'suspended' ? 'bg-tp-error/10 text-tp-error' :
                        'bg-tp-taupe/10 text-tp-taupe'
                      }`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3 text-tp-taupe capitalize">{s.subscriptionPlan || 'Basic'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.length === 0 && <div className="text-center py-16 text-tp-taupe bg-white border border-tp-border rounded">No applications.</div>}
          {inquiries.map(inq => (
            <div key={inq.id} className="bg-white border border-tp-border rounded p-6 shadow-luxe">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium text-tp-charcoal">{inq.name}</h3>
                  <p className="text-sm text-tp-taupe">{inq.email} · {inq.phone}</p>
                  <p className="text-sm text-tp-gold mt-1">{inq.businessName} <span className="text-tp-taupe">({inq.businessType})</span></p>
                </div>
                <span className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full ${
                  inq.status === 'approved' ? 'bg-tp-success/10 text-tp-success' :
                  inq.status === 'rejected' ? 'bg-tp-error/10 text-tp-error' :
                  'bg-tp-warning/10 text-tp-warning'
                }`}>
                  {inq.status === 'approved' ? <CheckCircle2 size={12} /> : inq.status === 'rejected' ? <XCircle size={12} /> : <Clock size={12} />}
                  <span className="capitalize">{inq.status}</span>
                </span>
              </div>

              <p className="text-sm text-tp-taupe leading-relaxed mb-4 line-clamp-3">{inq.description}</p>

              {inq.status === 'pending' && (
                <div className="flex gap-2">
                  <button disabled={updating === inq.id} onClick={() => handleInquiry(inq.id!, 'approved')}
                    className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase bg-tp-success/10 text-tp-success border border-tp-success/20 rounded hover:bg-tp-success hover:text-white transition-colors disabled:opacity-50">
                    <CheckCircle2 size={14} /> Approve
                  </button>
                  <button disabled={updating === inq.id} onClick={() => handleInquiry(inq.id!, 'rejected')}
                    className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase bg-tp-error/10 text-tp-error border border-tp-error/20 rounded hover:bg-tp-error hover:text-white transition-colors disabled:opacity-50">
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
