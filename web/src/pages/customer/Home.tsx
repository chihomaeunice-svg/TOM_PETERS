import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Star, Shield, Sparkles, Store } from 'lucide-react';
import { GLSLHills } from '@/components/ui/glsl-hills';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
});

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const CATEGORIES = [
  { name: 'Outerwear', slug: 'outerwear', accent: 'from-stone-800 to-stone-600' },
  { name: 'Knitwear',  slug: 'knitwear',  accent: 'from-stone-700 to-amber-900' },
  { name: 'Shirts',    slug: 'shirts',    accent: 'from-neutral-700 to-stone-500' },
  { name: 'Trousers',  slug: 'trousers',  accent: 'from-zinc-800 to-zinc-600' },
  { name: 'Accessories', slug: 'accessories', accent: 'from-amber-900 to-stone-700' },
];

const MARQUEE_ITEMS = [
  'PREMIUM QUALITY', 'CURATED BRANDS', 'TIMELESS STYLE', 'CRAFTED TO LAST',
  'HAND APPROVED', 'LUXURY FABRICS', 'PREMIUM QUALITY', 'CURATED BRANDS',
  'TIMELESS STYLE', 'CRAFTED TO LAST', 'HAND APPROVED', 'LUXURY FABRICS',
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative bg-tp-charcoal text-tp-cream min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-60">
          <GLSLHills width="100%" height="100%" cameraZ={125} planeSize={256} speed={0.5} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-tp-charcoal/50 via-tp-charcoal/30 to-tp-charcoal/90 z-[1]" />
        <div className="relative z-[2] text-center px-4 max-w-4xl mx-auto">
          <motion.p {...fadeUp(0)} className="text-xs tracking-[0.4em] text-tp-gold uppercase mb-8">
            Premium Collection · Est. 2024
          </motion.p>
          <motion.h1 {...fadeUp(0.15)} className="font-display text-6xl sm:text-7xl lg:text-9xl tracking-[0.04em] uppercase leading-[0.9] mb-10">
            Crafted<br />
            <span className="text-tp-gold italic">for the</span><br />
            Discerning
          </motion.h1>
          <motion.p {...fadeUp(0.3)} className="text-tp-beige/80 leading-relaxed max-w-sm mx-auto mb-12 text-sm tracking-wide">
            Premium clothing for those who value quality, craftsmanship, and timeless elegance.
          </motion.p>
          <motion.div {...fadeUp(0.45)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="bg-gold-gradient text-white px-10 py-4 text-xs tracking-[0.25em] uppercase flex items-center justify-center gap-3 hover:opacity-90 transition-opacity">
              Explore Collection <ArrowRight size={14} />
            </Link>
            <Link to="/become-a-seller" className="border border-tp-cream/20 text-tp-cream/80 px-10 py-4 text-xs tracking-[0.25em] uppercase flex items-center justify-center gap-2 hover:border-tp-gold hover:text-tp-gold transition-colors">
              Sell With Us
            </Link>
          </motion.div>
        </div>
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] text-tp-cream/40 uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-tp-gold/60 to-transparent" />
        </motion.div>
      </section>

      {/* ── Marquee strip ─────────────────────────────────────────────── */}
      <div className="bg-tp-gold overflow-hidden py-3">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="flex gap-0 whitespace-nowrap"
        >
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="text-[10px] tracking-[0.3em] uppercase text-white font-medium px-8">
              {item} <span className="opacity-50 mx-2">✦</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Categories ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <Section>
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase text-tp-gold mb-3">Browse</p>
              <h2 className="font-display text-4xl text-tp-charcoal tracking-wide">Shop by Category</h2>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-2 text-xs tracking-widest uppercase text-tp-taupe hover:text-tp-gold transition-colors">
              View All <ArrowRight size={13} />
            </Link>
          </div>
        </Section>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group relative block overflow-hidden rounded"
                style={{ aspectRatio: i === 0 ? '2/3' : '3/4' }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.accent} group-hover:scale-105 transition-transform duration-700`} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-1 group-hover:text-tp-gold transition-colors duration-300">Shop</span>
                  <span className="font-display text-white text-base tracking-wider uppercase">{cat.name}</span>
                  <motion.div
                    className="w-0 h-px bg-tp-gold mt-2 group-hover:w-full transition-all duration-500"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Editorial strip ───────────────────────────────────────────── */}
      <Section>
        <div className="bg-tp-charcoal py-24 px-4 overflow-hidden relative">
          <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex items-center justify-center">
            <span className="font-display text-[20vw] text-white tracking-widest uppercase">TP</span>
          </div>
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                { icon: Star, title: 'Premium Quality', desc: 'Every piece is crafted from the finest materials, sourced from trusted global suppliers.' },
                { icon: Sparkles, title: 'Curated Brands', desc: 'Every seller is hand-approved. Only brands that meet our standards make it through.' },
                { icon: Shield, title: 'Secure Shopping', desc: 'Safe checkout, buyer protection, and hassle-free returns on every order.' },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                  className="flex flex-col items-center gap-5"
                >
                  <div className="w-14 h-14 rounded-full border border-tp-gold/30 flex items-center justify-center bg-tp-gold/5">
                    <f.icon size={22} className="text-tp-gold" />
                  </div>
                  <div className="w-8 h-px bg-tp-gold/40" />
                  <h3 className="font-display text-tp-cream tracking-wider text-lg">{f.title}</h3>
                  <p className="text-tp-tan/70 text-sm leading-relaxed max-w-xs">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Sell With Us CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <Section>
          <div className="max-w-6xl mx-auto">
            <div className="relative bg-tp-charcoal rounded overflow-hidden">
              {/* Background text watermark */}
              <div className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none select-none opacity-[0.04]">
                <span className="font-display text-[12vw] text-white tracking-widest uppercase leading-none">SELL</span>
              </div>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-3 p-10 md:p-16 flex flex-col justify-center">
                  <p className="text-[10px] tracking-[0.35em] uppercase text-tp-gold mb-6">Partner With Us</p>
                  <Store size={28} className="text-tp-gold mb-6" />
                  <h2 className="font-display text-4xl text-tp-cream mb-6 leading-tight">
                    Sell With<br />
                    <span className="text-tp-gold italic">Tompeters</span>
                  </h2>
                  <p className="text-tp-tan/70 leading-relaxed mb-10 text-sm max-w-md">
                    We curate only the best. If your brand meets our standards, we would love to have you. Submit an inquiry and our team will review your application within 3–5 business days.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/become-a-seller" className="bg-gold-gradient text-white px-8 py-4 text-xs tracking-[0.25em] uppercase inline-flex items-center gap-3 hover:opacity-90 transition-opacity self-start">
                      Submit Inquiry <ArrowRight size={14} />
                    </Link>
                    <Link to="/seller/register" className="border border-tp-cream/20 text-tp-cream/70 px-8 py-4 text-xs tracking-[0.25em] uppercase inline-flex items-center gap-2 hover:border-tp-gold hover:text-tp-gold transition-colors self-start">
                      Register as Seller
                    </Link>
                  </div>
                </div>
                <div className="md:col-span-2 hidden md:flex items-center justify-center p-14 border-l border-white/5">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                      className="w-32 h-32 rounded-full border border-tp-gold/20 flex items-center justify-center mb-6 mx-auto relative"
                    >
                      <div className="w-24 h-24 rounded-full border border-tp-gold/10 flex items-center justify-center">
                        <span className="font-display text-3xl text-tp-gold/40 tracking-widest">TP</span>
                      </div>
                      <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-tp-gold rounded-full -translate-x-1/2 -translate-y-1/2" />
                    </motion.div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-tp-tan/40">Seller Partner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </section>

    </div>
  );
}
