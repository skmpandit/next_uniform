// src/lib/wishlist.ts
export const WL_KEY = "nextuniform_wishlist_v1";

export type WishlistItem = {
  quantity: any;
  id: string;
  name?: string;
  price?: number;
  image?: string;
  category?: string;
  subcategory?: string;
  moq?: number;
};

function emitChange() {
  try {
    window.dispatchEvent(new CustomEvent("wishlist:changed"));
  } catch {}
}

export function readWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(WL_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function writeWishlist(items: WishlistItem[]) {
  localStorage.setItem(WL_KEY, JSON.stringify(items));
  emitChange();
}

export function isInWishlist(id: string) {
  return readWishlist().some(i => i.id === id);
}

export function addToWishlist(item: WishlistItem) {
  const cur = readWishlist();
  if (!cur.some(i => i.id === item.id)) {
    writeWishlist([item, ...cur]);
  }
}

export function removeFromWishlist(id: string) {
  const cur = readWishlist();
  writeWishlist(cur.filter(i => i.id !== id));
}

export function toggleWishlist(item: WishlistItem) {
  const cur = readWishlist();
  const exists = cur.some(i => i.id === item.id);
  writeWishlist(exists ? cur.filter(i => i.id !== item.id) : [item, ...cur]);
}