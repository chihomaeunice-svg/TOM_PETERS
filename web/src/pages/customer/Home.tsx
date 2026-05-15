import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Crown, Star } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-tp-charcoal text-tp-cream min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-tp-charcoal via-tp-charcoal to-tp-taupe/40" />
        <div className="relative text-center px-4 max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-tp-gold uppercase mb-6">New Collection</p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-[0.05em] uppercase leading-none mb-8">
            Crafted<br />
            <span className="text-tp-gold">for the</span><br />
            Discerning
          </h1>
          <p className="text-tp-beige leading-relaxed max-w-md mx-auto mb-10">
            Premium clothing for those who value quality, craftsmanship, and timeless style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="bg-gold-gradient text-white px-8 py-4 text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link to="/limited-drops" className="border border-tp-cream/40 text-tp-cream px-8 py-4 text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:border-tp-gold hover:text-tp-gold transition-colors">
              Limited Drops <Zap size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl text-tp-charcoal tracking-wide">Shop by Category</h2>
          <div className="w-16 h-px bg-tp-gold mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Outerwear', 'Knitwear', 'Shirts', 'Trousers'].map(cat => (
            <Link
              key={cat}
              to={`/shop?category=${cat.toLowerCase()}`}
              className="group relative aspect-square bg-tp-silk overflow-hidden rounded"
            >
              <div className="absolute inset-0 bg-tp-charcoal/20 group-hover:bg-tp-charcoal/40 transition-colors flex items-end p-4">
                <span className="text-white font-display tracking-wider text-sm uppercase">{cat}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-tp-charcoal py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { icon: Star, title: 'Premium Quality', desc: 'Every piece is crafted from the finest materials, sourced from trusted suppliers.' },
            { icon: Zap, title: 'Limited Drops', desc: 'Exclusive collections released in small batches. Once they\'re gone, they\'re gone.' },
            { icon: Crown, title: 'Members Benefits', desc: 'Join our members program for early access, exclusive pieces, and special privileges.' },
          ].map(f => (
            <div key={f.title} className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-tp-gold/30 flex items-center justify-center">
                <f.icon size={22} className="text-tp-gold" />
              </div>
              <h3 className="font-display text-tp-cream tracking-wide">{f.title}</h3>
              <p className="text-tp-tan text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Members CTA */}
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <Crown size={36} className="text-tp-gold mx-auto mb-6" />
        <h2 className="font-display text-3xl text-tp-charcoal mb-4">Members Only Access</h2>
        <p className="text-tp-taupe leading-relaxed max-w-xl mx-auto mb-8">
          Unlock exclusive collections, early access to limited drops, and personalised styling services. Membership is by invitation or subscription.
        </p>
        <Link to="/members" className="bg-gold-gradient text-white px-10 py-4 text-sm tracking-widest uppercase inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
          Explore Membership <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
