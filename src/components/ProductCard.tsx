import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/hooks/use-toast";
import { FolderHeart } from 'lucide-react';
import { Button } from './ui/button';
/* Optional: import OptimizedImage if you created it:
import OptimizedImage from '@/components/OptimizedImage';
*/

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  images?: string[];
  sizes?: string[];
  description?: string[];
  details?: string[];
  careInstructions?: string[];
  isNew?: boolean;
  rating?: number;
  reviews?: number;
  category?: string;
  subcategory?: string;
  moq?: number;
  hoverImage?: string;
  // optional slug if you have human-readable urls
  slug?: string;
}

const formatINR = (n: number) => n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.52 3.48A11.94 11.94 0 0 0 12 0C5.37 0 .01 5.36.01 12c0 2.11.55 4.16 1.6 5.98L0 24l6.2-1.6a12.04 12.04 0 0 0 5.8 1.48h.01c6.63 0 12-5.36 12-12 0-3.2-1.25-6.2-3.49-8.4ZM12 21.75h-.01c-1.9 0-3.76-.5-5.39-1.46l-.39-.23-3.68.95.98-3.59-.25-.41A9.73 9.73 0 0 1 2.25 12C2.25 6.62 6.62 2.25 12 2.25c2.6 0 5.04 1.01 6.87 2.85A9.67 9.67 0 0 1 21.75 12c0 5.38-4.37 9.75-9.75 9.75Zm5.51-7.27c-.3-.15-1.79-.89-2.06-.99-.28-.1-.48-.15-.68.15-.2.29-.78.99-.95 1.2-.17.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.46-.89-.79-1.49-1.76-1.67-2.06-.17-.29-.02-.45.13-.6.14-.14.3-.35.45-.52.15-.17.2-.29.3-.49.1-.2.06-.38-.03-.53-.09-.15-.68-1.62-.93-2.22-.24-.58-.48-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.27.29-1.05 1.02-1.05 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.09 4.49.71.31 1.26.5 1.68.64.7.22 1.34.19 1.85.11.56-.08 1.79-.73 2.05-1.43.25-.7.25-1.29.17-1.43-.07-.14-.26-.23-.56-.38Z"/>
  </svg>
);

const getWhatsAppNumber = (override?: string) => {
  const fromEnv = (import.meta as any)?.env?.VITE_WHATSAPP_NUMBER as string | undefined;
  const raw = (override || fromEnv || "919674984559").toString();
  return raw.replace(/\D/g, "");
};

const buildWhatsAppLink = ({ waNumber, id, name, price, moq = 50, slug }: { waNumber?: string; id: string; name: string; price: number; moq?: number; slug?: string }) => {
  const phone = getWhatsAppNumber(waNumber);
  const productLink = (typeof window !== 'undefined' ? `${window.location.origin}/product/${(slug || id)}` : `https://www.nextuniform.com/product/${(slug || id)}`);
  const text = `Hi! I'm interested in "${name}" (MOQ ${moq} pcs, Price ${formatINR(price)}). Product: ${productLink}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

const ProductCard: React.FC<ProductCardProps & { waNumber?: string }> = ({ id, name, price, images = [], isNew, moq = 50, hoverImage, category, subcategory, slug }) => {
  const { toast } = useToast();
  const { toggle, has } = useWishlist();
  const inWL = has(id);
  const img = images[0] ?? '';

  const waLink = buildWhatsAppLink({ id, name, price, moq, slug });

  // canonical public product url (use slug when available)
  const productUrl = (typeof window !== 'undefined' ? `${window.location.origin}/product/${(slug || id)}` : `https://www.nextuniform.com/product/${(slug || id)}`);

  // compact product json-ld for listing pages (optional; remove if you want schema only on detail pages)
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "image": img ? [img] : [],
    "sku": id,
    "url": productUrl,
    "brand": { "@type": "Brand", "name": "Next Uniform" },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "INR",
      "price": price?.toString?.() ?? undefined,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.18 }}
      className="group h-full"
    >
      <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-white/80 dark:bg-neutral-900/80 shadow-sm">
        {/* image + link to product */}
        <Link to={`/product/${(slug || id)}`} className="block shrink-0" title={`${name} — View product details`}>
          <div className="relative w-full aspect-[2/3] bg-gray-50 overflow-hidden">
            {img ? (
              <>
                {/* If you have OptimizedImage, prefer that for srcset/width/height */}
                {/* <OptimizedImage src={img} alt={`${name} — ${category} by Next Uniform`} width={600} height={900} /> */}
                <img
                  src={img}
                  alt={`${name} — ${category ?? 'Product'} by Next Uniform`}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  // include width/height if known: width={600} height={900}
                />
                {hoverImage && (
                  <img
                    src={hoverImage}
                    alt={`${name} hover — ${category ?? 'Product'} by Next Uniform`}
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full grid place-items-center text-sm text-muted-foreground">
                Image coming soon
              </div>
            )}

            {isNew && (
              <span className="absolute left-3 top-3 rounded-full bg-emerald-600 text-white px-3 py-1 text-xs font-medium">
                New
              </span>
            )}
          </div>
        </Link>

        {/* body */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1 min-h-0">
            <h3 className="font-semibold text-sm md:text-base text-foreground line-clamp-2">
              <Link to={`/product/${(slug || id)}`} className="hover:underline" title={`View details for ${name}`}>{name}</Link>
            </h3>
            <div className="mt-2 text-xs text-muted-foreground">MOQ: {moq} pcs</div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-green-800 font-semibold text-sm">{formatINR(price)}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  const already = inWL;
                  toggle({
                    id, name, price, image: img, category, subcategory, moq,
                    quantity: undefined
                  });
                  toast({ title: already ? "Removed from wishlist" : "Added to wishlist" });
                }}
                aria-pressed={inWL}
                className="p-2 rounded-md bg-white/90 hover:bg-white shadow-sm"
                title={inWL ? "Remove from wishlist" : "Add to wishlist"}
              >
                <FolderHeart className={`w-4 h-4 ${inWL ? 'text-rose-600' : 'text-gray-700'}`} />
              </button>
            </div>
          </div>

          {/* actions */}
          <div className="mt-4 flex gap-2 items-center w-full flex-wrap">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Chat on WhatsApp about ${name}`}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              <WhatsAppIcon /> Chat
            </a>

            <button
              onClick={(e) => {
                e.preventDefault();
                const already = inWL;
                toggle({
                  id, name, price, image: img, category, subcategory, moq,
                  quantity: undefined
                });
                toast({ title: already ? "Removed from wishlist" : "Added to wishlist" });
              }}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium border ${inWL ? 'bg-accent text-accent-foreground border-accent' : 'bg-white text-foreground border-border'}`}
              aria-label={inWL ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
            >
              <FolderHeart className="w-4 h-4" />
              <span className="truncate">{inWL ? "Added" : "Wishlist"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* JSON-LD for this product card (optional on listing pages) */}
      <script type="application/ld+json">
        {JSON.stringify(productJsonLd)}
      </script>
    </motion.article>
  );
};

export default ProductCard;