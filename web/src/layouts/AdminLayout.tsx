import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutDashboard, Users, CreditCard, ShoppingCart, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { logoutUser } from '../services/auth';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/sellers', label: 'Sellers', icon: Users },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/admin/orders', label: 'All Orders', icon: ShoppingCart },
];

export default function AdminLayout() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-tp-silk flex">
      <aside className="w-64 bg-tp-charcoal text-tp-cream flex flex-col fixed h-full">
        <div className="p-6 border-b border-tp-taupe/20">
          <Link to="/" className="font-display text-lg tracking-[0.12em] uppercase text-tp-gold">
            TOM PETERS
          </Link>
          <p className="text-xs text-tp-tan mt-1 tracking-wider uppercase">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded text-sm transition-colors ${
                  active ? 'bg-tp-gold text-white' : 'text-tp-beige hover:bg-tp-taupe/20'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-tp-taupe/20 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-2 text-sm text-tp-tan hover:text-tp-cream transition-colors">
            <ChevronRight size={16} /> View Store
          </Link>
          <div className="px-4 py-2">
            <p className="text-xs text-tp-taupe">{profile?.displayName}</p>
            <p className="text-xs text-tp-taupe/70 truncate">{profile?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-sm text-tp-rose hover:text-white transition-colors w-full"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 overflow-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
