import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Zap, Crown, Star } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
});

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-tp-charcoal text-tp-cream min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-tp-charcoal via-tp-charcoal to-tp-taupe/40" />
        <div className="relative text-center px-4 max-w-3xl mx-auto">
          <motion.p {...fadeUp(0)} className="text-xs tracking-[0.3em] text-tp-gold uppercase mb-6">
            New Collection
          </motion.p>
          <motion.h1 {...fadeUp(0.15)} className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-[0.05em] uppercase leading-none mb-8">
            Crafted<br />
            <span className="text-tp-gold">for the</span><br />
            Discerning
          </motion.h1>
          <motion.p {...fadeUp(0.3)} className="text-tp-beige leading-relaxed max-w-md mx-auto mb-10">
            Premium clothing for those who value quality, craftsmanship, and timeless style.
          </motion.p>
          <motion.div {...fadeUp(0.45)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="bg-gold-gradient text-white px-8 py-4 text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link to="/limited-drops" className="border border-tp-cream/40 text-tp-cream px-8 py-4 text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:border-tp-gold hover:text-tp-gold transition-colors">
              Limited Drops <Zap size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <h2 className="font-display text-3xl text-tp-charcoal tracking-wide">Shop by Category</h2>
          <div className="w-16 h-px bg-tp-gold mx-auto mt-4" />
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Outerwear', 'Knitwear', 'Shirts', 'Trousers'].map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
            >
              <Link
                to={`/shop?category=${cat.toLowerCase()}`}
                className="group relative aspect-square bg-tp-silk overflow-hidden rounded block"
              >
                <div className="absolute inset-0 bg-tp-charcoal/20 group-hover:bg-tp-charcoal/40 transition-colors flex items-end p-4">
                  <span className="text-white font-display tracking-wider text-sm uppercase">{cat}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-tp-charcoal py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { icon: Star, title: 'Premium Quality', desc: 'Every piece is crafted from the finest materials, sourced from trusted suppliers.' },
            { icon: Zap, title: 'Limited Drops', desc: "Exclusive collections released in small batches. Once they're gone, they're gone." },
            { icon: Crown, title: 'Members Benefits', desc: 'Join our members program for early access, exclusive pieces, and special privileges.' },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: 'easeOut' }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full border border-tp-gold/30 flex items-center justify-center">
                <f.icon size={22} className="text-tp-gold" />
              </div>
              <h3 className="font-display text-tp-cream tracking-wide">{f.title}</h3>
              <p className="text-tp-tan text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Members CTA */}
      <motion.section {...fadeUp(0)} className="py-20 px-4 max-w-4xl mx-auto text-center">
        <Crown size={36} className="text-tp-gold mx-auto mb-6" />
        <h2 className="font-display text-3xl text-tp-charcoal mb-4">Members Only Access</h2>
        <p className="text-tp-taupe leading-relaxed max-w-xl mx-auto mb-8">
          Unlock exclusive collections, early access to limited drops, and personalised styling services. Membership is by invitation or subscription.
        </p>
        <Link to="/members" className="bg-gold-gradient text-white px-10 py-4 text-sm tracking-widest uppercase inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
          Explore Membership <ArrowRight size={16} />
        </Link>
      </motion.section>
    </div>
  );
}
