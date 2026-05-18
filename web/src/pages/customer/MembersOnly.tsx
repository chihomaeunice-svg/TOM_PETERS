import { Crown, Star, Zap, Gift, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const PERKS = [
  { icon: Zap, title: 'Early Access', desc: 'Shop limited drops 24 hours before they go public.' },
  { icon: Crown, title: 'Exclusive Pieces', desc: 'Access to members-only collections not available to the public.' },
  { icon: Gift, title: 'Birthday Gift', desc: 'A curated gift from Tom Peters delivered to you every year.' },
  { icon: Star, title: 'Priority Service', desc: 'Dedicated customer service line and express shipping on all orders.' },
];

export default function MembersOnly() {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <Lock size={48} className="mx-auto mb-6 text-tp-beige" />
        <h1 className="font-display text-3xl text-tp-charcoal mb-4">Members Only</h1>
        <p className="text-tp-taupe mb-8">You need an account to access the Members area.</p>
        <Link to="/login" className="bg-tp-charcoal text-tp-cream px-8 py-3 text-sm tracking-widest uppercase inline-block hover:opacity-80 transition-opacity">
          Sign In
        </Link>
      </div>
    );
  }

  if (!profile.isMember) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Crown size={48} className="mx-auto mb-6 text-tp-gold" />
          <h1 className="font-display text-4xl text-tp-charcoal mb-4">Members Program</h1>
          <p className="text-tp-taupe leading-relaxed max-w-xl mx-auto">
            Join the Tom Peters Members Program for exclusive access, early drops, and premium privileges. Membership is available by invitation or subscription.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {PERKS.map(perk => (
            <div key={perk.title} className="bg-white border border-tp-border rounded p-6 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-tp-gold/10 flex items-center justify-center flex-shrink-0">
                <perk.icon size={18} className="text-tp-gold" />
              </div>
              <div>
                <h3 className="font-medium text-tp-charcoal mb-1">{perk.title}</h3>
                <p className="text-sm text-tp-taupe leading-relaxed">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-tp-charcoal rounded p-8 text-center">
          <p className="text-tp-cream font-display text-xl mb-3">Interested in Membership?</p>
          <p className="text-tp-tan text-sm mb-6 leading-relaxed">
            Contact our team to learn about membership availability or purchase a subscription plan below.
          </p>
          <a href="mailto:members@tompeters.com"
            className="bg-gold-gradient text-white px-8 py-3 text-sm tracking-widest uppercase inline-block hover:opacity-90 transition-opacity">
            Request Membership
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <Crown size={40} className="mx-auto mb-4 text-tp-gold" />
        <h1 className="font-display text-4xl text-tp-charcoal mb-3">Welcome, Member</h1>
        <p className="text-tp-taupe">Hello, {profile.displayName}. Enjoy your exclusive access.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {PERKS.map(perk => (
          <div key={perk.title} className="bg-white border border-tp-border rounded p-6 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-tp-gold/10 flex items-center justify-center flex-shrink-0">
              <perk.icon size={18} className="text-tp-gold" />
            </div>
            <div>
              <h3 className="font-medium text-tp-charcoal mb-1">{perk.title}</h3>
              <p className="text-sm text-tp-taupe">{perk.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link to="/shop" className="bg-tp-charcoal text-tp-cream px-10 py-4 text-sm tracking-widest uppercase inline-block hover:opacity-80 transition-opacity">
          Shop Members Collection
        </Link>
      </div>
    </div>
  );
}
