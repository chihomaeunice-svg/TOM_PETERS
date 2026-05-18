import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { addProduct } from '../../services/firestore';
import { ChevronLeft, Plus, X } from 'lucide-react';

const CATEGORIES = ['Outerwear', 'Knitwear', 'Shirts', 'Trousers', 'Accessories', 'Other'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function AddProduct() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [isLimitedDrop, setIsLimitedDrop] = useState(false);
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateSize = (size: string, qty: number) => {
    setSizes(s => qty > 0 ? { ...s, [size]: qty } : Object.fromEntries(Object.entries(s).filter(([k]) => k !== size)));
  };

  const updateImageUrl = (i: number, val: string) => {
    setImageUrls(urls => { const next = [...urls]; next[i] = val; return next; });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setError('');
    setLoading(true);
    try {
      const validImages = imageUrls.filter(u => u.trim() !== '');
      await addProduct({
        name,
        description,
        price: parseFloat(price),
        category,
        sizes,
        images: validImages,
        sellerId: profile.uid,
        sellerName: profile.displayName,
        isLimitedDrop,
        isActive: true,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      navigate('/seller/products');
    } catch (err: any) {
      setError(err.message || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-tp-taupe hover:text-tp-gold transition-colors mb-6">
        <ChevronLeft size={16} /> Back
      </button>
      <h1 className="font-display text-3xl text-tp-charcoal mb-8">Add Product</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-tp-border rounded p-8 shadow-luxe space-y-6">
        {error && <div className="bg-tp-error/10 border border-tp-error/20 rounded px-4 py-3 text-sm text-tp-error">{error}</div>}

        <div>
          <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Product Name</label>
          <input required value={name} onChange={e => setName(e.target.value)}
            className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream"
            placeholder="e.g. Cashmere Rollneck" />
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Description</label>
          <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)}
            className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream resize-none"
            placeholder="Describe the product, materials, fit…" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Price (USD)</label>
            <input required type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)}
              className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream"
              placeholder="299.00" />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Category</label>
            <select required value={category} onChange={e => setCategory(e.target.value)}
              className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream">
              <option value="">Select…</option>
              {CATEGORIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-3">Sizes & Stock</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {SIZES.map(size => (
              <div key={size}>
                <label className="block text-xs text-center text-tp-taupe mb-1">{size}</label>
                <input type="number" min="0" value={sizes[size] || ''} onChange={e => updateSize(size, parseInt(e.target.value) || 0)}
                  className="w-full border border-tp-border rounded px-2 py-2 text-sm text-center focus:outline-none focus:border-tp-gold bg-tp-cream"
                  placeholder="0" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-3">Image URLs</label>
          {imageUrls.map((url, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={url} onChange={e => updateImageUrl(i, e.target.value)}
                className="flex-1 border border-tp-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream"
                placeholder="https://…" />
              {imageUrls.length > 1 && (
                <button type="button" onClick={() => setImageUrls(urls => urls.filter((_, j) => j !== i))}
                  className="p-2.5 text-tp-taupe hover:text-tp-error transition-colors border border-tp-border rounded">
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          {imageUrls.length < 5 && (
            <button type="button" onClick={() => setImageUrls(u => [...u, ''])}
              className="flex items-center gap-2 text-sm text-tp-taupe hover:text-tp-gold transition-colors mt-1">
              <Plus size={14} /> Add Image URL
            </button>
          )}
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">Tags (comma-separated)</label>
          <input value={tags} onChange={e => setTags(e.target.value)}
            className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream"
            placeholder="luxury, cashmere, winter" />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={isLimitedDrop} onChange={e => setIsLimitedDrop(e.target.checked)}
            className="w-4 h-4 accent-tp-gold" />
          <span className="text-sm text-tp-charcoal">Mark as Limited Drop</span>
        </label>

        <button type="submit" disabled={loading}
          className="w-full bg-tp-charcoal text-tp-cream py-3 text-sm tracking-widest uppercase hover:opacity-80 transition-opacity disabled:opacity-60">
          {loading ? 'Adding…' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}
