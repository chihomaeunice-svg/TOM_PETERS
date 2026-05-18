import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextValue {
  wishlistIds: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue>({
  wishlistIds: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isWishlisted: () => false,
});

const STORAGE_KEY = 'tp_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const addToWishlist = (id: string) => {
    setWishlistIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const removeFromWishlist = (id: string) => {
    setWishlistIds(prev => prev.filter(wid => wid !== id));
  };

  const isWishlisted = (id: string) => wishlistIds.includes(id);

  return (
    <WishlistContext.Provider value={{ wishlistIds, addToWishlist, removeFromWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
