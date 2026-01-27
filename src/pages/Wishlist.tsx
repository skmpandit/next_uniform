import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWishlist } from "@/hooks/useWishlist";
import { writeWishlist } from "@/lib/wishlist";
import SEO from '@/components/SEO'; // <-- added

const formatINR = (n: number) =>
  n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

/**
 * Wishlist page:
 * - Shows MOQs (default to 50 if not present)
 * - Quantity starts at MOQ and can't go below MOQ
 * - Quantity changes are persisted to localStorage (writeWishlist) and therefore
 *   broadcast via your existing wishlist:changed + storage events (useWishlist listens)
 * - Subtotal reflects current quantities in realtime
 */
const Wishlist = () => {
  const { items, remove, clear } = useWishlist();

  // local map of quantities keyed by item id (keeps UI snappy)
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});

  // Initialize qtyMap from items (or keep in sync when items change)
  useEffect(() => {
    const next: Record<string, number> = {};
    for (const it of items) {
      // take existing quantity from item if present, else fallback to moq or 50
      const moq = typeof it.moq === "number" && it.moq > 0 ? it.moq : 50;
      next[it.id] = Math.max(moq, typeof it.quantity === "number" && it.quantity > 0 ? it.quantity : moq);
    }
    setQtyMap(prev => {
      // merge so UI doesn't jump for unchanged items
      return { ...next, ...prev };
    });
  }, [items]);

  // helper to persist qty changes to localStorage (writeWishlist) so other pages update
  const persistQuantities = (updatedMap: Record<string, number>) => {
    // Map current items into new wishlist items with quantity
    const newList = items.map(i => {
      const q = updatedMap[i.id];
      // keep existing fields and set quantity
      return { ...i, quantity: q ?? (typeof i.moq === "number" && i.moq > 0 ? i.moq : 50) };
    });
    writeWishlist(newList);
    // writeWishlist emits custom event so your useWishlist hook will update `items`
  };

  const changeQuantity = (id: string, delta: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const moq = typeof item.moq === "number" && item.moq > 0 ? item.moq : 50;
    const cur = qtyMap[id] ?? moq;
    const next = Math.max(moq, cur + delta);
    const nextMap = { ...qtyMap, [id]: next };
    setQtyMap(nextMap);
    persistQuantities(nextMap);
  };

  const setQuantity = (id: string, value: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const moq = typeof item.moq === "number" && item.moq > 0 ? item.moq : 50;
    const safe = Math.max(moq, Math.floor(value));
    const nextMap = { ...qtyMap, [id]: safe };
    setQtyMap(nextMap);
    persistQuantities(nextMap);
  };

  // When removing an item, we want to remove any qty state as well.
  const handleRemove = (id: string) => {
    remove(id);
    // also remove from local qtyMap for cleanliness
    setQtyMap(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    // removal persists via useWishlist.remove -> writeWishlist inside your lib
  };

  // realtime subtotal derived from items and qtyMap
  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const q = qtyMap[it.id] ?? (typeof it.moq === "number" && it.moq > 0 ? it.moq : it.quantity ?? 50);
      return sum + (it.price || 0) * q;
    }, 0);
  }, [items, qtyMap]);

  // UI: empty state
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-screen-xl mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Your wishlist is empty</h1>
              <p className="text-muted-foreground">Tap the heart on any product to save it here.</p>
            </div>
            <Button asChild>
              <Link to="/products">Explore Products</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // --- WhatsApp helpers ---
  const getWhatsAppNumber = (override?: string) => {
    const fromEnv = (import.meta as any)?.env?.VITE_WHATSAPP_NUMBER as string | undefined;
    const raw = (override || fromEnv || "919674084559").toString();
    return raw.replace(/\D/g, "");
  };

  const buildWishlistWhatsAppLink = ({
    waNumber,
    items,
    subtotal,
  }: {
    waNumber?: string;
    items: {
      id: string;
      name: string;
      quantity?: number;
      moq?: number;
      price: number;
    }[];
    subtotal: number;
  }) => {
    const phone = getWhatsAppNumber(waNumber);

    const itemLines = items
      .map((item, index) => {
        const qty = item.quantity || item.moq || 50;
        const link = `${window.location.origin}/product/${item.id}`;
        return `${index + 1}. ${item.name}\nQty: ${qty} pcs\nPrice: ₹${item.price.toLocaleString(
          "en-IN"
        )} each\nLink: ${link}`;
      })
      .join("\n\n");

    const text = `Hi! 👋 I’d like to discuss my wishlist items:\n\n${itemLines}\n\nEstimated Total: ₹${subtotal.toLocaleString(
      "en-IN"
    )}\n\nPlease assist me with pricing, customization, or bulk orders.`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  // --- SEO (only addition) ---------------------------------------------------
  const canonical = 'https://www.nextuniform.com/wishlist';
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Wishlist — Next Uniform",
    description: "Your saved products (wishlist) on Next Uniform. Share wishlist with our sales team for bulk pricing and customization.",
    url: canonical,
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", url: "https://www.nextuniform.com" },
    potentialAction: {
      "@type": "ViewAction",
      target: canonical,
      name: "View Wishlist"
    }
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Next Uniform",
    url: "https://www.nextuniform.com",
    logo: "https://www.nextuniform.com/logo.png",
    contactPoint: [{
      "@type": "ContactPoint",
      telephone: "+91-9674084559",
      contactType: "sales",
      areaServed: "IN",
      email: "sales@nextuniform.com"
    }]
  };
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* SEO component (no UI changes) */}
      <SEO
        title="Your Wishlist — Next Uniform"
        description="Save products you're interested in and share the wishlist with our sales team for bulk pricing or customization. Next Uniform — uniforms & workwear across India."
        canonical={canonical}
        image="https://www.nextuniform.com/og-image.jpg"
        jsonLd={[orgSchema, webpageSchema]}
      />

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-3 flex-col sm:flex-row mb-6">
            <h1 className="text-3xl font-bold">Your Wishlist</h1>
            <Button
              variant="ghost"
              className="text-destructive"
              onClick={() => {
                clear();
                setQtyMap({});
              }}
            >
              Clear Wishlist
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((item) => {
                  const moq = typeof item.moq === "number" && item.moq > 0 ? item.moq : 50;
                  const quantity = qtyMap[item.id] ?? (typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : moq);

                  return (
                    <Card key={item.id} className="overflow-hidden group flex flex-col">
                      <Link to={`/product/${item.id}`} className="block">
                        <div className="aspect-[2/3] bg-muted overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full grid place-items-center text-muted-foreground">No image</div>
                          )}
                        </div>
                      </Link>

                      <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link to={`/product/${item.id}`}>
                              <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                            </Link>
                            {item.category && (
                              <p className="text-xs text-muted-foreground">
                                {item.category}
                                {item.subcategory ? ` · ${item.subcategory}` : ""}
                              </p>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(item.id)}
                            className="shrink-0 text-destructive hover:text-destructive"
                            aria-label="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* quantity & price row */}
                        <div className="mt-auto flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="text-xs text-muted-foreground">MOQ</div>
                            <div className="text-sm font-medium">{moq} pcs</div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Decrease */}
                            <button
                              onClick={() => changeQuantity(item.id, -1)}
                              disabled={quantity <= moq}
                              aria-label={`Decrease quantity for ${item.name}`}
                              className={`flex items-center justify-center w-9 h-9 rounded-md border transition ${
                                quantity > moq ? "hover:bg-gray-100" : "opacity-40 cursor-not-allowed"
                              }`}
                            >
                              −
                            </button>

                            {/* Quantity display (editable) */}
                            <input
                              type="number"
                              min={moq}
                              value={quantity}
                              onChange={(e) => {
                                const v = Number(e.target.value || moq);
                                setQuantity(item.id, isNaN(v) ? moq : v);
                              }}
                              className="w-16 text-center rounded-md border px-2 py-1 text-sm"
                              aria-label={`Quantity for ${item.name}`}
                            />

                            {/* Increase */}
                            <button
                              onClick={() => changeQuantity(item.id, +1)}
                              aria-label={`Increase quantity for ${item.name}`}
                              className="flex items-center justify-center w-9 h-9 rounded-md border hover:bg-gray-100 transition"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-base font-semibold">{formatINR((item.price || 0) * quantity)}</div>
                          <Button asChild size="sm">
                            <Link to={`/product/${item.id}`}>View</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Summary / CTA */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Summary</h2>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Saved items</span>
                      <span>{items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated total</span>
                      <span>{formatINR(subtotal)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700 transition"
                  >
                    <a
                      href={buildWishlistWhatsAppLink({
                        waNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "919674084559",
                        items: items.map((i) => ({
                          id: i.id,
                          name: i.name,
                          price: i.price,
                          moq: i.moq,
                          quantity: qtyMap[i.id],
                        })),
                        subtotal,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chat on WhatsApp
                    </a>
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Tip: We’ll receive your wishlist details and help you with bulk pricing or customization.
                  </p>
                </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;