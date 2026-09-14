import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { logoutUser } from '../services/auth';

export default function CustomerLayout() {
  const { profile } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const navLinks = [
    { to: '/shop', label: 'Shop' },
    { to: '/wishlist', label: 'Saved' },
  ];

  return (
    <div className="min-h-screen bg-tp-cream flex flex-col">
      {/* Announcement bar */}
      <div className="bg-tp-charcoal text-tp-cream text-[10px] text-center py-2 overflow-hidden tracking-[0.2em] uppercase">
        <div className="inline-flex animate-marquee whitespace-nowrap">
          <span className="mx-10">FREE SHIPPING ON ORDERS OVER $150</span>
          <span className="mx-4 text-tp-gold">✦</span>
          <span className="mx-10">CURATED PREMIUM COLLECTIONS</span>
          <span className="mx-4 text-tp-gold">✦</span>
          <span className="mx-10">BECOME A SELLER — SELL WITH PECARE</span>
          <span className="mx-4 text-tp-gold">✦</span>
          <span className="mx-10">FREE SHIPPING ON ORDERS OVER $150</span>
          <span className="mx-4 text-tp-gold">✦</span>
          <span className="mx-10">CURATED PREMIUM COLLECTIONS</span>
          <span className="mx-4 text-tp-gold">✦</span>
          <span className="mx-10">BECOME A SELLER — SELL WITH PECARE</span>
          <span className="mx-4 text-tp-gold">✦</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-tp-cream/95 backdrop-blur-sm border-b border-tp-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-tp-charcoal">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link to="/" className="font-display text-[1.35rem] tracking-[0.18em] text-tp-charcoal font-semibold uppercase">
              PECARE
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`text-xs tracking-[0.15em] uppercase transition-colors ${
                    location.pathname.startsWith(l.to)
                      ? 'text-tp-gold-dark border-b border-tp-gold-dark pb-0.5'
                      : 'text-tp-charcoal hover:text-tp-gold'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-4">
              {profile?.role === 'seller' && (
                <Link to="/seller" className="text-[10px] tracking-[0.15em] text-tp-gold uppercase hidden sm:block">
                  Seller Hub
                </Link>
              )}
              {profile?.role === 'admin' && (
                <Link to="/admin" className="text-[10px] tracking-[0.15em] text-tp-gold uppercase hidden sm:block">
                  Admin
                </Link>
              )}

              {profile ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-tp-charcoal hover:text-tp-gold transition-colors">
                    <User size={19} />
                    <span className="text-xs hidden sm:block tracking-wide">{profile.displayName}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-tp-border shadow-luxe rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link to="/profile" className="block px-4 py-3 text-sm text-tp-charcoal hover:bg-tp-silk transition-colors">My Profile</Link>
                    <Link to="/orders" className="block px-4 py-3 text-sm text-tp-charcoal hover:bg-tp-silk transition-colors">My Orders</Link>
                    <Link to="/wishlist" className="flex items-center gap-2 px-4 py-3 text-sm text-tp-charcoal hover:bg-tp-silk transition-colors">
                      <Heart size={14} /> Saved Items
                    </Link>
                    <hr className="border-tp-border" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-tp-error hover:bg-tp-silk transition-colors">
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="text-tp-charcoal hover:text-tp-gold transition-colors">
                  <User size={19} />
                </Link>
              )}

              <Link to="/cart" className="relative text-tp-charcoal hover:text-tp-gold transition-colors">
                <ShoppingBag size={19} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-tp-gold text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="lg:hidden border-t border-tp-border bg-tp-cream px-4 py-4">
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-xs tracking-[0.15em] uppercase text-tp-charcoal border-b border-tp-border last:border-0"
              >
                {l.label}
              </Link>
            ))}
            {!profile && (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-3 text-xs tracking-[0.15em] uppercase text-tp-gold mt-2">
                Sign In
              </Link>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-tp-charcoal text-tp-cream py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="font-display text-xl tracking-[0.18em] mb-5 text-tp-cream">PECARE</div>
              <p className="text-sm text-tp-tan leading-relaxed">Curated premium clothing for those who dress with intention.</p>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase mb-5 text-tp-tan">Shop</h4>
              <div className="space-y-3 text-sm">
                <Link to="/shop" className="block text-tp-beige hover:text-tp-gold transition-colors">All Products</Link>
                <Link to="/wishlist" className="block text-tp-beige hover:text-tp-gold transition-colors">Saved Items</Link>
                <Link to="/become-a-seller" className="block text-tp-beige hover:text-tp-gold transition-colors">Sell With Us</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase mb-5 text-tp-tan">Account</h4>
              <div className="space-y-3 text-sm">
                <Link to="/profile" className="block text-tp-beige hover:text-tp-gold transition-colors">My Profile</Link>
                <Link to="/orders" className="block text-tp-beige hover:text-tp-gold transition-colors">Order History</Link>
                <Link to="/become-a-seller" className="block text-tp-beige hover:text-tp-gold transition-colors">Become a Seller</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase mb-5 text-tp-tan">Support</h4>
              <div className="space-y-3 text-sm text-tp-beige">
                <p>support@pecare.com</p>
                <p>Mon–Fri 9am–6pm EST</p>
              </div>
            </div>
          </div>
          <div className="border-t border-tp-taupe/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-tp-taupe">
            <span>© {new Date().getFullYear()} Pecare. All rights reserved.</span>
            <span className="tracking-[0.15em] uppercase text-tp-taupe/50">Dressed with intention.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
