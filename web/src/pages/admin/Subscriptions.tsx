import { useState, useEffect, FormEvent } from 'react';
import { getAllSubscriptionPlans, addSubscriptionPlan, updateSubscriptionPlan, SubscriptionPlan } from '../../services/firestore';
import { Plus, Edit2, Check, X } from 'lucide-react';

const EMPTY_PLAN: Omit<SubscriptionPlan, 'id'> = {
  name: '',
  price: 0,
  billingCycle: 'monthly',
  features: [],
  productLimit: 10,
  orderCommission: 5,
  hasAnalytics: false,
  hasPrioritySupport: false,
  isActive: true,
};

export default function AdminSubscriptions() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SubscriptionPlan | null>(null);
  const [form, setForm] = useState(EMPTY_PLAN);
  const [featuresText, setFeaturesText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    getAllSubscriptionPlans().then(setPlans).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_PLAN);
    setFeaturesText('');
    setShowForm(true);
  };

  const openEdit = (plan: SubscriptionPlan) => {
    setEditing(plan);
    setForm({ ...plan });
    setFeaturesText(plan.features.join('\n'));
    setShowForm(true);
  };

  const update = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const data = { ...form, features: featuresText.split('\n').map(f => f.trim()).filter(Boolean) };
      if (editing?.id) {
        await updateSubscriptionPlan(editing.id, data);
      } else {
        await addSubscriptionPlan(data);
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message || 'Failed to save plan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-tp-charcoal">Subscription Plans</h1>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-tp-charcoal text-tp-cream px-5 py-2.5 text-sm tracking-wider uppercase hover:opacity-80 transition-opacity">
          <Plus size={16} /> New Plan
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-tp-border rounded p-6 shadow-luxe mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-tp-charcoal">{editing ? 'Edit Plan' : 'New Plan'}</h2>
            <button onClick={() => setShowForm(false)} className="text-tp-taupe hover:text-tp-charcoal"><X size={20} /></button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {error && <div className="col-span-2 bg-tp-error/10 border border-tp-error/20 rounded px-4 py-3 text-sm text-tp-error">{error}</div>}

            <div>
              <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Plan Name</label>
              <input required value={form.name} onChange={e => update('name', e.target.value)}
                className="w-full border border-tp-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream"
                placeholder="e.g. Professional" />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Price</label>
              <input required type="number" min="0" step="0.01" value={form.price} onChange={e => update('price', parseFloat(e.target.value))}
                className="w-full border border-tp-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream" />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Billing Cycle</label>
              <select value={form.billingCycle} onChange={e => update('billingCycle', e.target.value)}
                className="w-full border border-tp-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream">
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs tracking-widests uppercase text-tp-taupe mb-2">Product Limit</label>
              <input type="number" min="0" value={form.productLimit} onChange={e => update('productLimit', parseInt(e.target.value))}
                className="w-full border border-tp-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream" />
            </div>

            <div>
              <label className="block text-xs tracking-widests uppercase text-tp-taupe mb-2">Commission %</label>
              <input type="number" min="0" max="100" step="0.1" value={form.orderCommission} onChange={e => update('orderCommission', parseFloat(e.target.value))}
                className="w-full border border-tp-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream" />
            </div>

            <div className="col-span-2 flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-tp-charcoal">
                <input type="checkbox" checked={form.hasAnalytics} onChange={e => update('hasAnalytics', e.target.checked)} className="accent-tp-gold" />
                Analytics
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-tp-charcoal">
                <input type="checkbox" checked={form.hasPrioritySupport} onChange={e => update('hasPrioritySupport', e.target.checked)} className="accent-tp-gold" />
                Priority Support
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-tp-charcoal">
                <input type="checkbox" checked={form.isActive} onChange={e => update('isActive', e.target.checked)} className="accent-tp-gold" />
                Active
              </label>
            </div>

            <div className="col-span-2">
              <label className="block text-xs tracking-widests uppercase text-tp-taupe mb-2">Features (one per line)</label>
              <textarea rows={4} value={featuresText} onChange={e => setFeaturesText(e.target.value)}
                className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream resize-none"
                placeholder="Up to 20 products&#10;Analytics dashboard&#10;Priority support" />
            </div>

            <div className="col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-tp-border text-sm text-tp-taupe rounded hover:border-tp-gold transition-colors">Cancel</button>
              <button type="submit" disabled={saving}
                className="px-5 py-2.5 bg-tp-charcoal text-tp-cream text-sm tracking-wider uppercase hover:opacity-80 disabled:opacity-60 transition-opacity">
                {saving ? 'Saving…' : 'Save Plan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="animate-pulse bg-white rounded h-48" />)}
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 bg-white border border-tp-border rounded text-tp-taupe">
          No subscription plans yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div key={plan.id} className={`bg-white border rounded p-6 shadow-luxe ${plan.isActive ? 'border-tp-border' : 'border-tp-border opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display text-lg text-tp-charcoal">{plan.name}</h3>
                  <p className="text-2xl font-medium text-tp-gold mt-1">
                    ${plan.price}<span className="text-sm text-tp-taupe">/{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </p>
                </div>
                <button onClick={() => openEdit(plan)} className="text-tp-taupe hover:text-tp-gold transition-colors p-1">
                  <Edit2 size={15} />
                </button>
              </div>

              <div className="space-y-1 mb-4 text-sm text-tp-taupe">
                <p>Up to {plan.productLimit} products</p>
                <p>{plan.orderCommission}% commission</p>
                {plan.hasAnalytics && <p className="flex items-center gap-1"><Check size={12} className="text-tp-success" /> Analytics</p>}
                {plan.hasPrioritySupport && <p className="flex items-center gap-1"><Check size={12} className="text-tp-success" /> Priority Support</p>}
              </div>

              {plan.features.length > 0 && (
                <ul className="text-xs text-tp-taupe space-y-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5"><span className="text-tp-gold">✦</span> {f}</li>
                  ))}
                </ul>
              )}

              {!plan.isActive && <p className="text-xs text-tp-taupe mt-3 italic">Inactive</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
