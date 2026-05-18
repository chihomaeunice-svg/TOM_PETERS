import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { submitSellerInquiry } from '../../services/auth';

const BUSINESS_TYPES = ['Clothing Brand', 'Independent Designer', 'Boutique', 'Manufacturer', 'Other'];

export default function BecomeASeller() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', businessName: '', businessType: '', description: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await submitSellerInquiry(form as any);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tp-cream py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <Link to="/" className="font-display text-3xl tracking-[0.15em] text-tp-charcoal uppercase">TOM PETERS</Link>
          <h1 className="text-2xl font-display mt-6 text-tp-charcoal">Become a Seller</h1>
          <p className="text-tp-taupe mt-3 leading-relaxed max-w-lg mx-auto">
            Join our curated marketplace of premium clothing brands. We review each application carefully to maintain the quality our customers expect.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white border border-tp-border rounded p-10 shadow-luxe text-center">
            <div className="text-5xl mb-4">✦</div>
            <h2 className="font-display text-xl text-tp-charcoal mb-3">Application Received</h2>
            <p className="text-tp-taupe text-sm leading-relaxed mb-4">Thank you for your interest. Our team will review your application and reach out within 3–5 business days.</p>
            <p className="text-tp-taupe text-sm leading-relaxed mb-6">Ready to set up your account now? Create your seller account and it will be activated once approved.</p>
            <Link to="/seller/register" className="inline-block w-full bg-tp-charcoal text-tp-cream py-3 text-sm tracking-widest uppercase text-center hover:opacity-80 transition-opacity mb-3">
              Create Seller Account
            </Link>
            <Link to="/" className="inline-block text-sm text-tp-taupe hover:text-tp-gold transition-colors">Return to Store</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-tp-border rounded p-8 shadow-luxe space-y-5">
            {error && <div className="bg-tp-error/10 border border-tp-error/20 rounded px-4 py-3 text-sm text-tp-error">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Jane Smith' },
                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@brand.com' },
                { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
                { label: 'Business Name', key: 'businessName', type: 'text', placeholder: 'Your Brand LLC' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">{f.label}</label>
                  <input type={f.type} required value={(form as any)[f.key]} onChange={e => update(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream" />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Business Type</label>
              <select required value={form.businessType} onChange={e => update('businessType', e.target.value)}
                className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream">
                <option value="">Select a type…</option>
                {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Tell Us About Your Brand</label>
              <textarea required rows={5} value={form.description} onChange={e => update('description', e.target.value)}
                placeholder="Describe your brand, your products, your target audience, and why you'd be a great fit for Tom Peters…"
                className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream resize-none" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-tp-charcoal text-tp-cream py-3 text-sm tracking-widest uppercase transition-opacity disabled:opacity-60 hover:opacity-80">
              {loading ? 'Submitting…' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
