import { Link } from 'react-router-dom';
import { logoutUser } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

export default function SellerPending() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-tp-cream flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <Link to="/" className="font-display text-3xl tracking-[0.15em] text-tp-charcoal uppercase block mb-10">
          TOMPETERS
        </Link>
        <div className="bg-white border border-tp-border rounded p-10 shadow-luxe">
          <div className="text-5xl mb-6">✦</div>
          <h2 className="font-display text-2xl text-tp-charcoal mb-4">Application Under Review</h2>
          <p className="text-tp-taupe text-sm leading-relaxed mb-6">
            Your seller account has been created and is pending approval from our team. We'll activate your account within 3–5 business days.
          </p>
          <p className="text-tp-taupe text-sm leading-relaxed mb-8">
            Once approved, you'll be able to sign in and access your seller dashboard.
          </p>
          <button
            onClick={handleSignOut}
            className="w-full bg-tp-charcoal text-tp-cream py-3 text-sm tracking-widest uppercase hover:opacity-80 transition-opacity"
          >
            Sign Out
          </button>
          <Link to="/" className="block mt-4 text-sm text-tp-taupe hover:text-tp-gold transition-colors">
            Browse the Store
          </Link>
        </div>
      </div>
    </div>
  );
}
