import { Link } from 'react-router-dom';
import { Product } from '../../services/firestore';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const totalStock = Object.values(product.sizes || {}).reduce((s, n) => s + n, 0);
  const lowStock = totalStock > 0 && totalStock < 10;
  const image = product.images?.[0];

  return (
    <Link
      to={`/shop/${product.id}`}
      className="group block card overflow-hidden hover:shadow-luxe transition-all duration-300"
    >
      <div className="relative aspect-[3/4] bg-tp-silk overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-tp-taupe font-display text-2xl">
            TP
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {lowStock && (
            <span className="bg-tp-warning/90 text-white label-caps px-2 py-1 rounded-full">Low stock</span>
          )}
        </div>
      </div>
      <div className="p-4">
        <p className="label-caps text-tp-taupe">{product.category}</p>
        <h3 className="mt-1 text-base font-display text-tp-charcoal line-clamp-1">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-tp-charcoal font-medium">${product.price.toFixed(2)}</p>
          <span className="text-xs text-tp-taupe">{Object.keys(product.sizes || {}).length} sizes</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
