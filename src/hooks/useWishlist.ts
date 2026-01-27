// src/hooks/useWishlist.ts
import { useEffect, useState, useCallback } from "react";
import {
  WishlistItem,
  readWishlist,
  writeWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  isInWishlist,
} from "@/lib/wishlist";

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    setItems(readWishlist());
  }, []);

  // Same-tab realtime sync (custom event)
  useEffect(() => {
    const onCustom = () => setItems(readWishlist());
    const handler = onCustom as EventListener;
    window.addEventListener("wishlist:changed", handler);
    return () => window.removeEventListener("wishlist:changed", handler);
    }, []);

  // Cross-tab sync (native storage event)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "nextuniform_wishlist_v1") {
        setItems(readWishlist());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((item: WishlistItem) => {
    addToWishlist(item);
    setItems(readWishlist()); // immediate local update
  }, []);

  const remove = useCallback((id: string) => {
    removeFromWishlist(id);
    setItems(readWishlist());
  }, []);

  const toggle = useCallback((item: WishlistItem) => {
    toggleWishlist(item);
    setItems(readWishlist());
  }, []);

  const clear = useCallback(() => {
    writeWishlist([]);
    setItems([]);
  }, []);

  const has = useCallback((id: string) => isInWishlist(id), []);

  return { items, add, remove, toggle, clear, has };
}