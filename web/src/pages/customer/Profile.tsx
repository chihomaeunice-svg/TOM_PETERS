import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, MapPin, Bell, Shield, LogOut, Check, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { updateUserProfile, logoutUser } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';

type Tab = 'profile' | 'address' | 'notifications' | 'security';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile',       label: 'Personal Info',   icon: User },
  { id: 'address',       label: 'Shipping Address', icon: MapPin },
  { id: 'notifications', label: 'Notifications',    icon: Bell },
  { id: 'security',      label: 'Security',         icon: Shield },
];

function SaveButton({ saving, saved }: { saving: boolean; saved: boolean }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="flex items-center gap-2 bg-tp-charcoal text-tp-cream px-6 py-3 text-xs tracking-[0.2em] uppercase hover:opacity-80 transition-opacity disabled:opacity-60"
    >
      {saved ? <><Check size={14} /> Saved</> : saving ? 'Saving…' : 'Save Changes'}
    </button>
  );
}

export default function Profile() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Profile tab state
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [phone, setPhone] = useState((profile as any)?.phone || '');
  const [bio, setBio] = useState((profile as any)?.bio || '');

  // Address tab state
  const addr = (profile as any)?.address || {};
  const [line1, setLine1] = useState(addr.line1 || '');
  const [line2, setLine2] = useState(addr.line2 || '');
  const [city, setCity] = useState(addr.city || '');
  const [state, setState] = useState(addr.state || '');
  const [zip, setZip] = useState(addr.zip || '');
  const [country, setCountry] = useState(addr.country || '');

  // Notifications state
  const notifs = (profile as any)?.notifications || {};
  const [emailOrders, setEmailOrders] = useState(notifs.emailOrders ?? true);
  const [emailPromos, setEmailPromos] = useState(notifs.emailPromos ?? false);
  const [emailNews, setEmailNews] = useState(notifs.emailNews ?? false);

  if (!profile) return null;

  const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const persist = async (data: Record<string, any>) => {
    setError('');
    setSaving(true);
    try {
      await updateUserProfile(profile.uid, data as any);
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setError(e.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleProfile = (e: FormEvent) => {
    e.preventDefault();
    persist({ displayName, phone, bio } as any);
  };

  const handleAddress = (e: FormEvent) => {
    e.preventDefault();
    persist({ address: { line1, line2, city, state, zip, country } } as any);
  };

  const handleNotifications = (e: FormEvent) => {
    e.preventDefault();
    persist({ notifications: { emailOrders, emailPromos, emailNews } } as any);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <BackButton label="Back to Shop" to="/shop" />

      {/* Header */}
      <div className="flex items-center gap-6 mb-10">
        <div className="w-16 h-16 rounded-full bg-tp-charcoal flex items-center justify-center flex-shrink-0">
          <span className="font-display text-xl text-tp-gold tracking-widest">{initials}</span>
        </div>
        <div>
          <h1 className="font-display text-3xl text-tp-charcoal">{profile.displayName}</h1>
          <p className="text-sm text-tp-taupe mt-0.5">{profile.email}</p>
          <span className="inline-block mt-1.5 text-[10px] tracking-[0.2em] uppercase bg-tp-gold/10 text-tp-gold-dark px-2.5 py-1 rounded-full">
            {profile.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar tabs */}
        <aside className="md:col-span-1">
          <nav className="bg-white border border-tp-border rounded shadow-luxe overflow-hidden">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setError(''); setSaved(false); }}
                className={`w-full flex items-center justify-between px-4 py-4 text-sm border-b border-tp-border last:border-0 transition-colors ${
                  tab === t.id
                    ? 'bg-tp-charcoal text-tp-cream'
                    : 'text-tp-charcoal hover:bg-tp-silk'
                }`}
              >
                <div className="flex items-center gap-3">
                  <t.icon size={15} className={tab === t.id ? 'text-tp-gold' : 'text-tp-taupe'} />
                  <span className="text-xs tracking-wider">{t.label}</span>
                </div>
                <ChevronRight size={13} className="opacity-40" />
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-4 text-sm text-tp-error hover:bg-tp-error/5 transition-colors"
            >
              <LogOut size={15} />
              <span className="text-xs tracking-wider">Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Content panel */}
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white border border-tp-border rounded shadow-luxe p-8"
            >
              {error && (
                <div className="bg-tp-error/10 border border-tp-error/20 rounded px-4 py-3 text-sm text-tp-error mb-6">
                  {error}
                </div>
              )}

              {/* ── Personal Info ──────────────────────────────── */}
              {tab === 'profile' && (
                <form onSubmit={handleProfile} className="space-y-6">
                  <SectionHeader title="Personal Information" desc="Update your name, phone, and a short bio." />
                  <Field label="Full Name">
                    <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                      className="tp-input" placeholder="Jane Smith" />
                  </Field>
                  <Field label="Email Address">
                    <input value={profile.email} disabled className="tp-input opacity-50 cursor-not-allowed" />
                    <p className="text-xs text-tp-taupe mt-1">Email cannot be changed here.</p>
                  </Field>
                  <Field label="Phone Number">
                    <input value={phone} onChange={e => setPhone(e.target.value)} type="tel"
                      className="tp-input" placeholder="+1 (555) 000-0000" />
                  </Field>
                  <Field label="Bio">
                    <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                      className="tp-input resize-none" placeholder="A short line about yourself…" />
                  </Field>
                  <SaveButton saving={saving} saved={saved} />
                </form>
              )}

              {/* ── Shipping Address ───────────────────────────── */}
              {tab === 'address' && (
                <form onSubmit={handleAddress} className="space-y-6">
                  <SectionHeader title="Shipping Address" desc="Your default address for orders." />
                  <Field label="Address Line 1">
                    <input value={line1} onChange={e => setLine1(e.target.value)}
                      className="tp-input" placeholder="123 Main Street" />
                  </Field>
                  <Field label="Address Line 2 (optional)">
                    <input value={line2} onChange={e => setLine2(e.target.value)}
                      className="tp-input" placeholder="Apartment, suite, floor…" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="City">
                      <input value={city} onChange={e => setCity(e.target.value)}
                        className="tp-input" placeholder="New York" />
                    </Field>
                    <Field label="State / Province">
                      <input value={state} onChange={e => setState(e.target.value)}
                        className="tp-input" placeholder="NY" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Postal Code">
                      <input value={zip} onChange={e => setZip(e.target.value)}
                        className="tp-input" placeholder="10001" />
                    </Field>
                    <Field label="Country">
                      <input value={country} onChange={e => setCountry(e.target.value)}
                        className="tp-input" placeholder="United States" />
                    </Field>
                  </div>
                  <SaveButton saving={saving} saved={saved} />
                </form>
              )}

              {/* ── Notifications ──────────────────────────────── */}
              {tab === 'notifications' && (
                <form onSubmit={handleNotifications} className="space-y-6">
                  <SectionHeader title="Notification Preferences" desc="Choose what emails you'd like to receive." />
                  <div className="space-y-4">
                    {[
                      { label: 'Order updates', desc: 'Confirmations, shipping, and delivery notifications.', value: emailOrders, set: setEmailOrders },
                      { label: 'Promotions & sales', desc: 'Exclusive discounts and seasonal offers.', value: emailPromos, set: setEmailPromos },
                      { label: 'News & arrivals', desc: 'New collections and brand announcements.', value: emailNews, set: setEmailNews },
                    ].map(item => (
                      <div key={item.label} className="flex items-start justify-between py-4 border-b border-tp-border last:border-0">
                        <div>
                          <p className="text-sm font-medium text-tp-charcoal">{item.label}</p>
                          <p className="text-xs text-tp-taupe mt-0.5">{item.desc}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => item.set(!item.value)}
                          className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-6 ${item.value ? 'bg-tp-gold' : 'bg-tp-border'}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${item.value ? 'translate-x-5' : ''}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <SaveButton saving={saving} saved={saved} />
                </form>
              )}

              {/* ── Security ──────────────────────────────────── */}
              {tab === 'security' && (
                <div className="space-y-6">
                  <SectionHeader title="Security" desc="Manage your account security settings." />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-tp-border rounded bg-tp-silk/40">
                      <div>
                        <p className="text-sm font-medium text-tp-charcoal">Password</p>
                        <p className="text-xs text-tp-taupe mt-0.5">Last changed — unknown</p>
                      </div>
                      <a href="/forgot-password" className="text-xs tracking-widest uppercase text-tp-gold hover:underline">
                        Reset
                      </a>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-tp-border rounded bg-tp-silk/40">
                      <div>
                        <p className="text-sm font-medium text-tp-charcoal">Account Role</p>
                        <p className="text-xs text-tp-taupe mt-0.5 capitalize">{profile.role}</p>
                      </div>
                      <span className="text-[10px] tracking-widest uppercase text-tp-taupe bg-tp-border px-2 py-1 rounded">Read only</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-tp-border rounded bg-tp-silk/40">
                      <div>
                        <p className="text-sm font-medium text-tp-charcoal">Account Status</p>
                        <p className="text-xs text-tp-taupe mt-0.5 capitalize">{profile.status}</p>
                      </div>
                      <span className={`text-[10px] tracking-widest uppercase px-2 py-1 rounded ${profile.status === 'active' ? 'bg-tp-success/10 text-tp-success' : 'bg-tp-error/10 text-tp-error'}`}>
                        {profile.status}
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-tp-border">
                    <p className="text-xs text-tp-taupe mb-3">To permanently delete your account, contact us at support@tompeters.com.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="pb-5 border-b border-tp-border mb-2">
      <h2 className="font-display text-xl text-tp-charcoal">{title}</h2>
      <p className="text-xs text-tp-taupe mt-1">{desc}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.2em] uppercase text-tp-taupe mb-2">{label}</label>
      {children}
    </div>
  );
}
