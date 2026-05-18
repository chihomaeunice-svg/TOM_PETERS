import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';
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
      if (err.code === 'auth/user-not-found') {
        setSent(true);
      } else {
        setError(err.message || 'Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tp-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-3xl tracking-[0.15em] text-tp-charcoal uppercase">
            TOMPETERS
          </Link>
          <p className="text-sm text-tp-taupe mt-3 tracking-wider">Reset your password</p>
        </div>

        <div className="bg-white border border-tp-border rounded p-8 shadow-luxe">
          {sent ? (
            <div className="text-center space-y-5 py-4">
              <CheckCircle2 size={40} className="text-tp-success mx-auto" />
              <h2 className="font-display text-xl text-tp-charcoal">Check Your Inbox</h2>
              <p className="text-sm text-tp-taupe leading-relaxed">
                If <strong className="text-tp-charcoal">{email}</strong> is registered, you'll receive a reset link shortly. Check your spam folder if it doesn't arrive within a few minutes.
              </p>
              <div className="bg-tp-silk border border-tp-border rounded px-4 py-3 text-xs text-tp-taupe text-left space-y-1">
                <p className="font-medium text-tp-charcoal">Didn't receive it?</p>
                <p>• Check your spam or junk folder</p>
                <p>• Make sure the email address is correct</p>
                <p>• Links expire after <strong>1 hour</strong></p>
              </div>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="w-full border border-tp-border text-tp-charcoal py-3 text-xs tracking-[0.2em] uppercase hover:border-tp-gold hover:text-tp-gold transition-colors"
              >
                Try a Different Email
              </button>
              <Link to="/login" className="block text-sm text-tp-taupe hover:text-tp-gold transition-colors">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-tp-error/10 border border-tp-error/20 rounded px-4 py-3 text-sm text-tp-error">
                  {error}
                </div>
              )}

              <div className="flex items-start gap-3 text-sm text-tp-taupe bg-tp-silk border border-tp-border rounded px-4 py-3">
                <Mail size={16} className="text-tp-gold mt-0.5 flex-shrink-0" />
                <span>Enter your account email and we'll send you a link to reset your password.</span>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-tp-charcoal text-tp-cream py-3 text-xs tracking-[0.2em] uppercase hover:opacity-80 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>

              <p className="text-center text-sm text-tp-taupe">
                Remember your password?{' '}
                <Link to="/login" className="text-tp-gold hover:underline">Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
