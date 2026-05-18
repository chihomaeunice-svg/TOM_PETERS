import { useState, useEffect, FormEvent } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { verifyResetCode, confirmReset } from '../../services/auth';

type Stage = 'verifying' | 'form' | 'success' | 'invalid';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = params.get('oobCode') || '';

  const [stage, setStage] = useState<Stage>('verifying');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!oobCode) { setStage('invalid'); return; }
    verifyResetCode(oobCode)
      .then(userEmail => { setEmail(userEmail); setStage('form'); })
      .catch(() => setStage('invalid'));
  }, [oobCode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError('');
    setLoading(true);
    try {
      await confirmReset(oobCode, password);
      setStage('success');
    } catch (err: any) {
      if (err.code === 'auth/expired-action-code') {
        setError('This reset link has expired. Please request a new one.');
      } else {
        setError(err.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-tp-error', 'bg-tp-warning', 'bg-tp-success'];

  return (
    <div className="min-h-screen bg-tp-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-3xl tracking-[0.15em] text-tp-charcoal uppercase">
            TOMPETERS
          </Link>
          <p className="text-sm text-tp-taupe mt-3 tracking-wider">Set new password</p>
        </div>

        <div className="bg-white border border-tp-border rounded p-8 shadow-luxe">

          {/* Verifying */}
          {stage === 'verifying' && (
            <div className="flex flex-col items-center gap-4 py-6">
              <Loader2 size={28} className="text-tp-gold animate-spin" />
              <p className="text-sm text-tp-taupe">Verifying your reset link…</p>
            </div>
          )}

          {/* Invalid / expired */}
          {stage === 'invalid' && (
            <div className="text-center space-y-4 py-4">
              <XCircle size={40} className="text-tp-error mx-auto" />
              <h2 className="font-display text-xl text-tp-charcoal">Link Invalid or Expired</h2>
              <p className="text-sm text-tp-taupe">
                This password reset link is no longer valid. Links expire after 1 hour.
              </p>
              <Link
                to="/forgot-password"
                className="inline-block mt-2 w-full bg-tp-charcoal text-tp-cream py-3 text-xs tracking-[0.2em] uppercase hover:opacity-80 transition-opacity text-center"
              >
                Request New Link
              </Link>
              <Link to="/login" className="block text-sm text-tp-taupe hover:text-tp-gold transition-colors">
                Back to Sign In
              </Link>
            </div>
          )}

          {/* Password form */}
          {stage === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-tp-error/10 border border-tp-error/20 rounded px-4 py-3 text-sm text-tp-error">
                  {error}
                </div>
              )}

              <div className="bg-tp-silk border border-tp-border rounded px-4 py-3 text-sm">
                <span className="text-[10px] tracking-widest uppercase text-tp-taupe block mb-0.5">Resetting password for</span>
                <span className="font-medium text-tp-charcoal">{email}</span>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream pr-10"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-tp-taupe hover:text-tp-gold transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Strength bar */}
                {password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor[strength] : 'bg-tp-border'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-tp-taupe">{strengthLabel[strength]}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream"
                />
                {confirm.length > 0 && password !== confirm && (
                  <p className="text-xs text-tp-error mt-1">Passwords do not match</p>
                )}
                {confirm.length > 0 && password === confirm && (
                  <p className="text-xs text-tp-success mt-1">✓ Passwords match</p>
                )}
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-tp-charcoal text-tp-cream py-3 text-xs tracking-[0.2em] uppercase hover:opacity-80 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? 'Resetting…' : 'Set New Password'}
              </button>
            </form>
          )}

          {/* Success */}
          {stage === 'success' && (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 size={40} className="text-tp-success mx-auto" />
              <h2 className="font-display text-xl text-tp-charcoal">Password Reset</h2>
              <p className="text-sm text-tp-taupe">
                Your password has been updated successfully. You can now sign in with your new password.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-tp-charcoal text-tp-cream py-3 text-xs tracking-[0.2em] uppercase hover:opacity-80 transition-opacity mt-2"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
