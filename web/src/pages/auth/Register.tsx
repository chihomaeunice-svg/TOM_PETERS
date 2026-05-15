import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerCustomer } from '../../services/auth';

export default function Register() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await registerCustomer(email, password, displayName);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
          <p className="text-sm text-tp-taupe mt-3 tracking-wider">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-tp-border rounded p-8 shadow-luxe space-y-5">
          {error && (
            <div className="bg-tp-error/10 border border-tp-error/20 rounded px-4 py-3 text-sm text-tp-error">
              {error}
            </div>
          )}

          {[
            { label: 'Full Name', type: 'text', value: displayName, set: setDisplayName, placeholder: 'Jane Smith' },
            { label: 'Email', type: 'email', value: email, set: setEmail, placeholder: 'you@example.com' },
            { label: 'Password', type: 'password', value: password, set: setPassword, placeholder: '••••••••' },
            { label: 'Confirm Password', type: 'password', value: confirm, set: setConfirm, placeholder: '••••••••' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">{f.label}</label>
              <input
                type={f.type}
                required
                value={f.value}
                onChange={e => f.set(e.target.value)}
                placeholder={f.placeholder}
                className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tp-charcoal text-tp-cream py-3 text-sm tracking-widest uppercase transition-opacity disabled:opacity-60 hover:opacity-80"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-tp-taupe">
            Already have an account?{' '}
            <Link to="/login" className="text-tp-gold hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
