import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../config/firebase';
import { Product, getProductReviews, addProductReview, getCustomerOrders, Review } from '../../services/firestore';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { ShoppingBag, ChevronLeft, Heart, Star } from 'lucide-react';

function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i)}
          onMouseEnter={() => onChange && setHovered(i)}
          onMouseLeave={() => onChange && setHovered(0)}
          disabled={!onChange}
          className="disabled:cursor-default"
        >
          <Star
            size={18}
            className={`transition-colors ${
              i <= (hovered || rating)
                ? 'text-tp-gold fill-tp-gold'
                : 'text-tp-border'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const { profile } = useAuth();

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, 'products', id)).then(snap => {
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() } as Product);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setReviewsLoading(true);
    getProductReviews(id).then(setReviews).finally(() => setReviewsLoading(false));
  }, [id]);

  useEffect(() => {
    if (!profile || !id) {
      setCanReview(false);
      return;
    }
    getCustomerOrders(profile.uid).then(orders => {
      const hasOrdered = orders.some(o =>
        o.items.some(item => item.productId === id) &&
        (o.status === 'delivered' || o.status === 'shipped')
      );
      const hasAlreadyReviewed = reviews.some(r => r.customerId === profile.uid);
      setCanReview(hasOrdered && !hasAlreadyReviewed);
    });
  }, [profile, id, reviews]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-tp-silk rounded" />
        <div className="space-y-4">
          <div className="h-8 bg-tp-silk rounded w-2/3" />
          <div className="h-6 bg-tp-silk rounded w-1/4" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center text-tp-taupe">
      Product not found. <Link to="/shop" className="text-tp-gold underline">Browse Shop</Link>
    </div>
  );

  const sizes = Object.entries(product.sizes || {}).filter(([, stock]) => stock > 0);
  const wishlisted = isWishlisted(product.id!);

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem({
      productId: product.id!,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      size: selectedSize,
      qty: 1,
      sellerId: product.sellerId,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlistToggle = () => {
    if (wishlisted) removeFromWishlist(product.id!);
    else addToWishlist(product.id!);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !id) return;
    if (reviewComment.trim().length < 5) {
      setReviewError('Please write a longer comment.');
      return;
    }
    setSubmittingReview(true);
    setReviewError('');
    try {
      await addProductReview({
        productId: id,
        customerId: profile.uid,
        customerName: profile.displayName,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviewComment('');
      setReviewRating(5);
      const updated = await getProductReviews(id);
      setReviews(updated);
      setCanReview(false);
    } catch {
      setReviewError('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-tp-taupe hover:text-tp-gold transition-colors mb-8">
        <ChevronLeft size={16} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <div className="aspect-square bg-tp-silk rounded overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full"
              >
                {product.images?.[activeImage] ? (
                  <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display text-6xl text-tp-beige">TP</div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-tp-gold' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs tracking-widest uppercase text-tp-taupe mb-3">{product.category}</p>
          <h1 className="font-display text-3xl text-tp-charcoal mb-2">{product.name}</h1>

          {/* Average rating */}
          {avgRating !== null && (
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={Math.round(avgRating)} />
              <span className="text-sm text-tp-taupe">{avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}

          <p className="text-2xl text-tp-gold-dark mb-6">${product.price.toFixed(2)}</p>

          <p className="text-tp-taupe leading-relaxed mb-8">{product.description}</p>

          {/* Sizes */}
          <div className="mb-6">
            <p className="text-xs tracking-widest uppercase text-tp-taupe mb-3">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map(([size]) => (
                <motion.button
                  key={size}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 border text-sm transition-colors ${
                    selectedSize === size
                      ? 'border-tp-charcoal bg-tp-charcoal text-white'
                      : 'border-tp-border text-tp-charcoal hover:border-tp-gold'
                  }`}
                >
                  {size}
                </motion.button>
              ))}
              {sizes.length === 0 && <p className="text-sm text-tp-error">Out of stock</p>}
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!selectedSize || sizes.length === 0}
              className="flex-1 bg-tp-charcoal text-tp-cream py-4 text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={18} />
              <AnimatePresence mode="wait">
                <motion.span
                  key={added ? 'added' : 'default'}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleWishlistToggle}
              title={wishlisted ? 'Remove from saved' : 'Save item'}
              className={`w-14 border flex items-center justify-center transition-colors ${
                wishlisted
                  ? 'border-tp-error text-tp-error bg-tp-error/5'
                  : 'border-tp-border text-tp-taupe hover:border-tp-error hover:text-tp-error'
              }`}
            >
              <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
            </motion.button>
          </div>

        </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t border-tp-border pt-12">
        <h2 className="font-display text-2xl text-tp-charcoal mb-8">Reviews</h2>

        {reviewsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-tp-silk rounded h-20" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-tp-taupe text-sm">No reviews yet — be the first.</p>
        ) : (
          <div className="space-y-6 mb-10">
            {reviews.map(review => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-tp-border rounded p-5 bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-tp-charcoal text-sm">{review.customerName}</span>
                    <StarRating rating={review.rating} />
                  </div>
                  {review.createdAt?.toDate && (
                    <span className="text-xs text-tp-taupe">
                      {review.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
                <p className="text-sm text-tp-taupe leading-relaxed">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Leave a review form */}
        {canReview && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-tp-silk border border-tp-border rounded p-6"
          >
            <h3 className="font-display text-lg text-tp-charcoal mb-4">Leave a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-xs tracking-widest uppercase text-tp-taupe block mb-2">Your Rating</label>
                <StarRating rating={reviewRating} onChange={setReviewRating} />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-tp-taupe block mb-2">Your Review</label>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  rows={4}
                  placeholder="Share your thoughts about this product…"
                  className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-white resize-none"
                  required
                />
              </div>
              {reviewError && <p className="text-sm text-tp-error">{reviewError}</p>}
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-tp-charcoal text-tp-cream px-8 py-3 text-sm tracking-widest uppercase hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {submittingReview ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          </motion.div>
        )}

        {profile && !canReview && reviews.some(r => r.customerId === profile.uid) && (
          <p className="text-sm text-tp-taupe mt-4">You have already reviewed this product.</p>
        )}
      </div>
    </div>
  );
}
