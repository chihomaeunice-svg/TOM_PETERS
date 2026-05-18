import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../../services/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tp-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-3xl tracking-[0.15em] text-tp-charcoal uppercase">TOMPETERS</Link>
          <p className="text-sm text-tp-taupe mt-3 tracking-wider">Reset your password</p>
        </div>

        <div className="bg-white border border-tp-border rounded p-8 shadow-luxe">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-tp-success text-4xl">✓</div>
              <p className="text-sm text-tp-charcoal">Check your inbox. We've sent a reset link to <strong>{email}</strong>.</p>
              <Link to="/login" className="block mt-4 text-sm text-tp-gold hover:underline">Back to Sign In</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="bg-tp-error/10 border border-tp-error/20 rounded px-4 py-3 text-sm text-tp-error">{error}</div>}
              <p className="text-sm text-tp-taupe">Enter your email address and we'll send you a link to reset your password.</p>
              <div>
                <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream"
                  placeholder="you@example.com" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-tp-charcoal text-tp-cream py-3 text-sm tracking-widest uppercase transition-opacity disabled:opacity-60 hover:opacity-80">
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
              <p className="text-center text-sm text-tp-taupe">
                <Link to="/login" className="text-tp-gold hover:underline">Back to Sign In</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
