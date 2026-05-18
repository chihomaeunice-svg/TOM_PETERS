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
      <div className="bg-tp-charcoal text-tp-cream text-xs text-center py-2 overflow-hidden">
        <div className="inline-flex animate-marquee whitespace-nowrap">
          <span className="mx-8">FREE SHIPPING ON ORDERS OVER $150</span>
          <span className="mx-8">✦</span>
          <span className="mx-8">PREMIUM QUALITY — CURATED COLLECTIONS</span>
          <span className="mx-8">✦</span>
          <span className="mx-8">BECOME A SELLER — SELL WITH TOMPETERS</span>
          <span className="mx-8">✦</span>
          <span className="mx-8">FREE SHIPPING ON ORDERS OVER $150</span>
          <span className="mx-8">✦</span>
          <span className="mx-8">PREMIUM QUALITY — CURATED COLLECTIONS</span>
          <span className="mx-8">✦</span>
          <span className="mx-8">BECOME A SELLER — SELL WITH TOMPETERS</span>
          <span className="mx-8">✦</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-tp-cream border-b border-tp-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-tp-charcoal">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="font-display text-xl tracking-[0.15em] text-tp-charcoal font-bold uppercase">
              TOMPETERS
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`text-sm tracking-wider uppercase transition-colors ${
                    location.pathname.startsWith(l.to)
                      ? 'text-tp-gold-dark'
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
                <Link to="/seller" className="text-xs tracking-wider text-tp-gold uppercase hidden sm:block">
                  Seller Hub
                </Link>
              )}
              {profile?.role === 'admin' && (
                <Link to="/admin" className="text-xs tracking-wider text-tp-gold uppercase hidden sm:block">
                  Admin
                </Link>
              )}

              {profile ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-tp-charcoal hover:text-tp-gold transition-colors">
                    <User size={20} />
                    <span className="text-xs hidden sm:block">{profile.displayName}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-tp-border shadow-luxe rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
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
                  <User size={20} />
                </Link>
              )}

              <Link to="/cart" className="relative text-tp-charcoal hover:text-tp-gold transition-colors">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-tp-gold text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
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
                className="block py-3 text-sm tracking-wider uppercase text-tp-charcoal border-b border-tp-border last:border-0"
              >
                {l.label}
              </Link>
            ))}
            {!profile && (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-3 text-sm tracking-wider uppercase text-tp-gold mt-2">
                Sign In
              </Link>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-tp-charcoal text-tp-cream py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="font-display text-xl tracking-[0.15em] mb-4">TOMPETERS</div>
              <p className="text-sm text-tp-tan leading-relaxed">Premium clothing for those who appreciate quality, craftsmanship, and timeless style.</p>
            </div>
            <div>
              <h4 className="text-xs tracking-widest uppercase mb-4 text-tp-tan">Shop</h4>
              <div className="space-y-2 text-sm">
                <Link to="/shop" className="block text-tp-beige hover:text-tp-gold transition-colors">All Products</Link>
                <Link to="/wishlist" className="block text-tp-beige hover:text-tp-gold transition-colors">Saved Items</Link>
                <Link to="/become-a-seller" className="block text-tp-beige hover:text-tp-gold transition-colors">Sell With Us</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs tracking-widest uppercase mb-4 text-tp-tan">Account</h4>
              <div className="space-y-2 text-sm">
                <Link to="/profile" className="block text-tp-beige hover:text-tp-gold transition-colors">My Profile</Link>
                <Link to="/orders" className="block text-tp-beige hover:text-tp-gold transition-colors">Order History</Link>
                <Link to="/become-a-seller" className="block text-tp-beige hover:text-tp-gold transition-colors">Become a Seller</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs tracking-widest uppercase mb-4 text-tp-tan">Support</h4>
              <div className="space-y-2 text-sm text-tp-beige">
                <p>support@tompeters.com</p>
                <p>Mon–Fri 9am–6pm EST</p>
              </div>
            </div>
          </div>
          <div className="border-t border-tp-taupe/30 pt-6 text-center text-xs text-tp-taupe">
            © {new Date().getFullYear()} Tompeters. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
