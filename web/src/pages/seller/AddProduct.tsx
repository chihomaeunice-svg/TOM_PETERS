import { useState, FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../hooks/useAuth';
import { addProduct } from '../../services/firestore';
import { storage } from '../../config/firebase';
import { ChevronLeft, ImagePlus, X, Loader2 } from 'lucide-react';

const CATEGORIES = ['Outerwear', 'Knitwear', 'Shirts', 'Trousers', 'Accessories', 'Other'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface UploadedImage {
  preview: string;
  url: string;
  uploading: boolean;
  error?: string;
}

export default function AddProduct() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateSize = (size: string, qty: number) => {
    setSizes(s => qty > 0 ? { ...s, [size]: qty } : Object.fromEntries(Object.entries(s).filter(([k]) => k !== size)));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile || !e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 5 - images.length);

    const newImages: UploadedImage[] = files.map(f => ({
      preview: URL.createObjectURL(f),
      url: '',
      uploading: true,
    }));

    setImages(prev => [...prev, ...newImages]);

    await Promise.all(files.map(async (file, i) => {
      try {
        const storageRef = ref(storage, `products/${profile.uid}/${Date.now()}-${file.name}`);
        const task = uploadBytesResumable(storageRef, file);
        await new Promise<void>((resolve, reject) => task.on('state_changed', null, reject, resolve));
        const url = await getDownloadURL(task.snapshot.ref);
        setImages(prev => {
          const next = [...prev];
          const idx = prev.length - files.length + i;
          next[idx] = { ...next[idx], url, uploading: false };
          return next;
        });
      } catch {
        setImages(prev => {
          const next = [...prev];
          const idx = prev.length - files.length + i;
          next[idx] = { ...next[idx], uploading: false, error: 'Upload failed' };
          return next;
        });
      }
    }));

    e.target.value = '';
  };

  const removeImage = (i: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, j) => j !== i);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (images.some(img => img.uploading)) {
      setError('Please wait for all images to finish uploading.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await addProduct({
        name,
        description,
        price: parseFloat(price),
        category,
        sizes,
        images: images.filter(img => img.url).map(img => img.url),
        sellerId: profile.uid,
        sellerName: profile.displayName,
        isLimitedDrop: false,
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
          <label className="block text-xs tracking-widests uppercase text-tp-taupe mb-2">Description</label>
          <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)}
            className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream resize-none"
            placeholder="Describe the product, materials, fit…" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widests uppercase text-tp-taupe mb-2">Price (USD)</label>
            <input required type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)}
              className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream"
              placeholder="299.00" />
          </div>
          <div>
            <label className="block text-xs tracking-widests uppercase text-tp-taupe mb-2">Category</label>
            <select required value={category} onChange={e => setCategory(e.target.value)}
              className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream">
              <option value="">Select…</option>
              {CATEGORIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-widests uppercase text-tp-taupe mb-3">Sizes & Stock</label>
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

        {/* Image upload */}
        <div>
          <label className="block text-xs tracking-widests uppercase text-tp-taupe mb-3">Product Images (up to 5)</label>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square bg-tp-silk rounded overflow-hidden border border-tp-border">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                {img.uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 size={18} className="text-white animate-spin" />
                  </div>
                )}
                {img.error && (
                  <div className="absolute inset-0 bg-tp-error/20 flex items-center justify-center">
                    <span className="text-xs text-tp-error text-center px-1">{img.error}</span>
                  </div>
                )}
                {!img.uploading && (
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-tp-charcoal/80 rounded-full flex items-center justify-center text-white hover:bg-tp-error transition-colors">
                    <X size={10} />
                  </button>
                )}
              </div>
            ))}

            {images.length < 5 && (
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-tp-border rounded flex flex-col items-center justify-center gap-1 text-tp-taupe hover:border-tp-gold hover:text-tp-gold transition-colors">
                <ImagePlus size={20} />
                <span className="text-xs">Add</span>
              </button>
            )}
          </div>
          <p className="text-xs text-tp-taupe">Images upload directly to secure storage. Max 10MB each.</p>
        </div>

        <div>
          <label className="block text-xs tracking-widests uppercase text-tp-taupe mb-2">Tags (comma-separated)</label>
          <input value={tags} onChange={e => setTags(e.target.value)}
            className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream"
            placeholder="luxury, cashmere, winter" />
        </div>

        <button type="submit" disabled={loading || images.some(img => img.uploading)}
          className="w-full bg-tp-charcoal text-tp-cream py-3 text-sm tracking-widests uppercase hover:opacity-80 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Adding…' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}
