import { useState, FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { updateUserProfile } from '../../services/auth';
import { User, Save } from 'lucide-react';

export default function Profile() {
  const { profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  if (!profile) return null;

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await updateUserProfile(profile.uid, { displayName });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-tp-charcoal mb-8">My Profile</h1>

      <div className="bg-white border border-tp-border rounded p-8 shadow-luxe">
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-tp-border">
          <div className="w-16 h-16 rounded-full bg-tp-gold/10 flex items-center justify-center">
            <User size={28} className="text-tp-gold" />
          </div>
          <div>
            <h2 className="font-medium text-tp-charcoal text-lg">{profile.displayName}</h2>
            <p className="text-sm text-tp-taupe">{profile.email}</p>
            <span className="inline-block mt-1 text-xs bg-tp-gold/10 text-tp-gold-dark px-2 py-0.5 rounded capitalize tracking-wide">
              {profile.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {error && <div className="bg-tp-error/10 border border-tp-error/20 rounded px-4 py-3 text-sm text-tp-error">{error}</div>}

          <div>
            <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Display Name</label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Email Address</label>
            <input value={profile.email} disabled
              className="w-full border border-tp-border rounded px-4 py-3 text-sm bg-tp-silk text-tp-taupe cursor-not-allowed" />
            <p className="text-xs text-tp-taupe mt-1">Email cannot be changed here.</p>
          </div>

          {profile.isMember && (
            <div className="bg-tp-gold/10 border border-tp-gold/20 rounded px-4 py-3 text-sm text-tp-gold-dark">
              ✦ Active Member — Early access and exclusive benefits enabled.
            </div>
          )}

          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-tp-charcoal text-tp-cream px-6 py-3 text-sm tracking-widest uppercase hover:opacity-80 transition-opacity disabled:opacity-60">
            <Save size={16} />
            {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
