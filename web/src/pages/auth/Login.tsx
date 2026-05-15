import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const profile = await loginUser(email, password);
      if (profile.role === 'admin') navigate('/admin');
      else if (profile.role === 'seller') navigate('/seller');
      else navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tp-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-3xl tracking-[0.15em] text-tp-charcoal uppercase">
            TOM PETERS
          </Link>
          <p className="text-sm text-tp-taupe mt-3 tracking-wider">Welcome back</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-tp-border rounded p-8 shadow-luxe space-y-5">
          {error && (
            <div className="bg-tp-error/10 border border-tp-error/20 rounded px-4 py-3 text-sm text-tp-error">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream"
              placeholder="••••••••"
            />
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-xs text-tp-taupe hover:text-tp-gold transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tp-charcoal text-tp-cream py-3 text-sm tracking-widest uppercase transition-opacity disabled:opacity-60 hover:opacity-80"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-tp-taupe">
            No account?{' '}
            <Link to="/register" className="text-tp-gold hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
