import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Star, Shield, Sparkles, Store, Leaf } from 'lucide-react';
import { GLSLHills } from '@/components/ui/glsl-hills';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
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
  { name: 'Outerwear',   slug: 'outerwear',   accent: 'from-stone-800 to-stone-600' },
  { name: 'Knitwear',    slug: 'knitwear',    accent: 'from-stone-700 to-amber-900' },
  { name: 'Shirts',      slug: 'shirts',      accent: 'from-neutral-700 to-stone-500' },
  { name: 'Trousers',    slug: 'trousers',    accent: 'from-zinc-800 to-zinc-600' },
  { name: 'Accessories', slug: 'accessories', accent: 'from-amber-900 to-stone-700' },
];

const MARQUEE_ITEMS = [
  'DRESSED WITH INTENTION', 'PREMIUM QUALITY', 'CURATED WITH CARE', 'CRAFTED TO LAST',
  'HAND APPROVED', 'CONSCIOUS FASHION', 'DRESSED WITH INTENTION', 'PREMIUM QUALITY',
  'CURATED WITH CARE', 'CRAFTED TO LAST', 'HAND APPROVED', 'CONSCIOUS FASHION',
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative bg-tp-charcoal text-tp-cream min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50">
          <GLSLHills width="100%" height="100%" cameraZ={125} planeSize={256} speed={0.4} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-tp-charcoal/60 via-tp-charcoal/20 to-tp-charcoal/95 z-[1]" />
        <div className="relative z-[2] text-center px-4 max-w-4xl mx-auto">
          <motion.p {...fadeUp(0)} className="text-[10px] tracking-[0.45em] text-tp-gold uppercase mb-10">
            Pecare · Curated Premium Collection
          </motion.p>
          <motion.h1 {...fadeUp(0.15)} className="font-display text-6xl sm:text-7xl lg:text-[6.5rem] tracking-[0.03em] uppercase leading-[0.88] mb-10">
            Dressed<br />
            <span className="text-tp-gold italic font-normal">with</span><br />
            Intention
          </motion.h1>
          <motion.p {...fadeUp(0.3)} className="text-tp-beige/70 leading-relaxed max-w-xs mx-auto mb-14 text-sm tracking-wide">
            Premium clothing curated for those who wear what matters.
          </motion.p>
          <motion.div {...fadeUp(0.45)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="bg-gold-gradient text-white px-10 py-4 text-[10px] tracking-[0.28em] uppercase flex items-center justify-center gap-3 hover:opacity-90 transition-opacity">
              Explore Collection <ArrowRight size={13} />
            </Link>
            <Link to="/become-a-seller" className="border border-tp-cream/20 text-tp-cream/70 px-10 py-4 text-[10px] tracking-[0.28em] uppercase flex items-center justify-center gap-2 hover:border-tp-gold hover:text-tp-gold transition-colors">
              Sell With Us
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2"
        >
          <span className="text-[9px] tracking-[0.35em] text-tp-cream/30 uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 9, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-tp-gold/50 to-transparent" />
        </motion.div>
      </section>

      {/* ── Marquee strip ─────────────────────────────────────────────── */}
      <div className="bg-tp-gold overflow-hidden py-3">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          className="flex gap-0 whitespace-nowrap"
        >
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="text-[9px] tracking-[0.32em] uppercase text-white font-medium px-8">
              {item} <span className="opacity-40 mx-2">✦</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Brand intro ───────────────────────────────────────────────── */}
      <Section>
        <div className="max-w-3xl mx-auto text-center py-20 px-6">
          <p className="text-[10px] tracking-[0.4em] uppercase text-tp-gold mb-5">Our Philosophy</p>
          <h2 className="font-display text-3xl sm:text-4xl text-tp-charcoal leading-snug mb-6">
            Every piece tells a story.<br />
            <span className="italic font-normal text-tp-taupe">We curate the ones worth wearing.</span>
          </h2>
          <p className="text-tp-taupe text-sm leading-relaxed max-w-xl mx-auto">
            Pecare is a curated marketplace of premium clothing brands — each one hand-selected for quality,
            intention, and lasting design. We believe in dressing thoughtfully.
          </p>
        </div>
      </Section>

      {/* ── Categories ────────────────────────────────────────────────── */}
      <section className="pb-24 px-4 max-w-7xl mx-auto">
        <Section>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase text-tp-gold mb-3">Browse</p>
              <h2 className="font-display text-4xl text-tp-charcoal tracking-wide">Shop by Category</h2>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-tp-taupe hover:text-tp-gold transition-colors">
              View All <ArrowRight size={12} />
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
              transition={{ duration: 0.7, delay: i * 0.09 }}
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group relative block overflow-hidden rounded-sm"
                style={{ aspectRatio: i === 0 ? '2/3' : '3/4' }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.accent} group-hover:scale-[1.04] transition-transform duration-700`} />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <span className="text-[9px] tracking-[0.3em] uppercase text-white/50 mb-1 group-hover:text-tp-gold transition-colors duration-300">Shop</span>
                  <span className="font-display text-white text-sm tracking-wider uppercase">{cat.name}</span>
                  <div className="w-0 h-px bg-tp-gold mt-2 group-hover:w-full transition-all duration-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features strip ────────────────────────────────────────────── */}
      <Section>
        <div className="bg-tp-charcoal py-24 px-4 overflow-hidden relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center">
            <span className="font-display text-[22vw] text-white tracking-widest uppercase">PC</span>
          </div>
          <div className="max-w-5xl mx-auto relative z-10">
            <p className="text-[10px] tracking-[0.4em] uppercase text-tp-gold text-center mb-16">Why Pecare</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center">
              {[
                { icon: Star,     title: 'Premium Quality',   desc: 'Every piece is sourced from the finest materials and trusted suppliers worldwide.' },
                { icon: Sparkles, title: 'Hand Curated',      desc: 'Every seller is individually reviewed. Only brands meeting our standards make it through.' },
                { icon: Leaf,     title: 'Intentional Style', desc: 'We champion brands that design with purpose — style that lasts beyond trends.' },
                { icon: Shield,   title: 'Secure Shopping',   desc: 'Safe checkout, buyer protection, and hassle-free returns on every order.' },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.12 }}
                  className="flex flex-col items-center gap-5"
                >
                  <div className="w-12 h-12 rounded-full border border-tp-gold/25 flex items-center justify-center bg-tp-gold/5">
                    <f.icon size={20} className="text-tp-gold" />
                  </div>
                  <div className="w-6 h-px bg-tp-gold/35" />
                  <h3 className="font-display text-tp-cream tracking-wide text-base">{f.title}</h3>
                  <p className="text-tp-tan/65 text-xs leading-relaxed max-w-[200px]">{f.desc}</p>
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
            <div className="relative bg-tp-charcoal rounded-sm overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none select-none opacity-[0.035]">
                <span className="font-display text-[14vw] text-white tracking-widest uppercase leading-none">SELL</span>
              </div>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-3 p-10 md:p-16 flex flex-col justify-center">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-tp-gold mb-6">Partner With Us</p>
                  <Store size={26} className="text-tp-gold mb-6" />
                  <h2 className="font-display text-4xl text-tp-cream mb-5 leading-tight">
                    Sell With<br />
                    <span className="text-tp-gold italic font-normal">Pecare</span>
                  </h2>
                  <p className="text-tp-tan/65 leading-relaxed mb-10 text-sm max-w-md">
                    We curate only the best. If your brand dresses with intention and meets our standards,
                    we'd love to have you. Applications are reviewed within 3–5 business days.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/become-a-seller" className="bg-gold-gradient text-white px-8 py-4 text-[10px] tracking-[0.28em] uppercase inline-flex items-center gap-3 hover:opacity-90 transition-opacity self-start">
                      Submit Inquiry <ArrowRight size={13} />
                    </Link>
                    <Link to="/seller/register" className="border border-tp-cream/15 text-tp-cream/60 px-8 py-4 text-[10px] tracking-[0.28em] uppercase inline-flex items-center gap-2 hover:border-tp-gold hover:text-tp-gold transition-colors self-start">
                      Register as Seller
                    </Link>
                  </div>
                </div>
                <div className="md:col-span-2 hidden md:flex items-center justify-center p-14 border-l border-white/[0.04]">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                      className="w-32 h-32 rounded-full border border-tp-gold/15 flex items-center justify-center mb-6 mx-auto relative"
                    >
                      <div className="w-24 h-24 rounded-full border border-tp-gold/10 flex items-center justify-center">
                        <span className="font-display text-2xl text-tp-gold/35 tracking-widest">PC</span>
                      </div>
                      <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-tp-gold rounded-full -translate-x-1/2 -translate-y-1/2" />
                    </motion.div>
                    <p className="text-[9px] tracking-[0.3em] uppercase text-tp-tan/35">Seller Partner</p>
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
