import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { updateUserProfile } from '../../services/auth';
import { User, Store, Eye, Save } from 'lucide-react';

export default function SellerAccount() {
  const { profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [businessName, setBusinessName] = useState(profile?.businessName || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  if (!profile) return null;

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await updateUserProfile(profile.uid, { displayName, businessName });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-tp-charcoal mb-8">My Account</h1>

      {/* Subscription plan card */}
      <div className="bg-tp-charcoal rounded p-6 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs tracking-widest uppercase text-tp-tan mb-1">Current Plan</p>
          <p className="font-display text-xl text-tp-gold capitalize">{profile.subscriptionPlan || 'Basic'}</p>
          <p className="text-xs text-tp-tan mt-1 capitalize">Status: {profile.subscriptionStatus || 'Active'}</p>
        </div>
        <Store size={36} className="text-tp-gold/40" />
      </div>

      {/* Profile form */}
      <form onSubmit={handleSave} className="bg-white border border-tp-border rounded p-8 shadow-luxe space-y-5 mb-6">
        <div className="flex items-center gap-4 pb-6 border-b border-tp-border">
          <div className="w-14 h-14 rounded-full bg-tp-gold/10 flex items-center justify-center">
            <User size={24} className="text-tp-gold" />
          </div>
          <div>
            <p className="font-medium text-tp-charcoal">{profile.displayName}</p>
            <p className="text-sm text-tp-taupe">{profile.email}</p>
          </div>
        </div>

        {error && (
          <div className="bg-tp-error/10 border border-tp-error/20 rounded px-4 py-3 text-sm text-tp-error">{error}</div>
        )}

        <div>
          <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Display Name</label>
          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream"
          />
        </div>

        <div>
          <label className="block text-xs tracking-widests uppercase text-tp-taupe mb-2">Business Name</label>
          <input
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            placeholder="Your brand or business name"
            className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream"
          />
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Email Address</label>
          <input
            value={profile.email}
            disabled
            className="w-full border border-tp-border rounded px-4 py-3 text-sm bg-tp-silk text-tp-taupe cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-tp-charcoal text-tp-cream px-6 py-3 text-sm tracking-widest uppercase hover:opacity-80 transition-opacity disabled:opacity-60"
        >
          <Save size={15} />
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>

      {/* Preview store button */}
      <div className="bg-white border border-tp-border rounded p-6 shadow-luxe flex items-center justify-between">
        <div>
          <p className="font-medium text-tp-charcoal mb-1">Customer Preview</p>
          <p className="text-sm text-tp-taupe">See how your products appear to shoppers.</p>
        </div>
        <Link
          to={`/shop?seller=${profile.uid}`}
          className="flex items-center gap-2 border border-tp-border px-4 py-2.5 text-sm tracking-wider uppercase text-tp-charcoal hover:border-tp-gold hover:text-tp-gold transition-colors"
        >
          <Eye size={15} /> Preview Store
        </Link>
      </div>
    </div>
  );
}
