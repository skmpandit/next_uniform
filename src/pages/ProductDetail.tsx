import { useRef, useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Minus, Plus, Share2, Star, X, ZoomIn, FolderHeart, Info, Leaf, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { productData } from '@/data/product';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO'; // <-- ADDED

// --- Helpers / WhatsApp icon -----------------------------------------------
const formatINR = (n: number) =>
  n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.52 3.48A11.94 11.94 0 0 0 12 0C5.37 0 .01 5.36.01 12c0 2.11.55 4.16 1.6 5.98L0 24l6.2-1.6a12.04 12.04 0 0 0 5.8 1.48h.01c6.63 0 12-5.36 12-12 0-3.2-1.25-6.2-3.49-8.4ZM12 21.75h-.01c-1.9 0-3.76-.5-5.39-1.46l-.39-.23-3.68.95.98-3.59-.25-.41A9.73 9.73 0 0 1 2.25 12C2.25 6.62 6.62 2.25 12 2.25c2.6 0 5.04 1.01 6.87 2.85A9.67 9.67 0 0 1 21.75 12c0 5.38-4.37 9.75-9.75 9.75Zm5.51-7.27c-.3-.15-1.79-.89-2.06-.99-.28-.1-.48-.15-.68.15-.2.29-.78.99-.95 1.2-.17.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.46-.89-.79-1.49-1.76-1.67-2.06-.17-.29-.02-.45.13-.6.14-.14.3-.35.45-.52.15-.17.2-.29.3-.49.1-.2.06-.38-.03-.53-.09-.15-.68-1.62-.93-2.22-.24-.58-.48-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.27.29-1.05 1.02-1.05 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.09 4.49.71.31 1.26.5 1.68.64.7.22 1.34.19 1.85.11.56-.08 1.79-.73 2.05-1.43.25-.7.25-1.29.17-1.43-.07-.14-.26-.23-.56-.38Z"/>
  </svg>
);

// get whatsapp number (from env or fallback)
const getWhatsAppNumber = (override?: string) => {
  const fromEnv = (import.meta as any)?.env?.VITE_WHATSAPP_NUMBER as string | undefined;
  const raw = (override || fromEnv || "919674084559").toString();
  return raw.replace(/\D/g, "");
};

function buildWhatsAppLink(args: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string | null;
  moq?: number;
  waNumber?: string;
}) {
  const { id, name, price, quantity, size, moq = 50, waNumber } = args;
  const phone = getWhatsAppNumber(waNumber);
  const productLink = `${window.location.origin}/product/${id}`;
  const parts = [
    `Hi! I'm interested in "${name}".`,
    `Price: ${formatINR(price)}`,
    `Quantity: ${quantity}`,
    size ? `Size: ${size}` : undefined,
    `MOQ: ${moq} pcs`,
    `Product: ${productLink}`,
  ].filter(Boolean);
  return `https://wa.me/${phone}?text=${encodeURIComponent(parts.join(" | "))}`;
}

function ZoomModal({
  open,
  src,
  onClose,
  alt,
}: {
  open: boolean;
  src: string;
  onClose: () => void;
  alt?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [forceActualWidth, setForceActualWidth] = useState(false); // dev helper

  const updateScrollState = () => {
    const el = scrollerRef.current;
    if (!el) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    // small tolerance for fractional pixels
    const left = el.scrollLeft;
    const rightPossible = el.scrollWidth - el.clientWidth - 2;
    setCanScrollLeft(left > 2);
    setCanScrollRight(left < rightPossible);
  };

  const scrollByFraction = (dir: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.6);
    const target = dir === 'left' ? Math.max(0, el.scrollLeft - amount) : Math.min(el.scrollWidth - el.clientWidth, el.scrollLeft + amount);
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

  // keyboard handlers
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') scrollByFraction('left');
      if (e.key === 'ArrowRight') scrollByFraction('right');
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, src]);

  // attach scroll + resize listeners
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => updateScrollState();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateScrollState);
    // initial check (give a tick for layout)
    const t = setTimeout(updateScrollState, 60);
    return () => {
      clearTimeout(t);
      el.removeEventListener('scroll', onScroll as EventListener);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [open, src, forceActualWidth]);

  // when modal opens or image changes, ensure state is correct
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(updateScrollState, 80);
    return () => clearTimeout(t);
  }, [open, src]);

  const onImageLoad = () => {
    // after load allow layout to settle then recalc
    setTimeout(updateScrollState, 50);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={onClose}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            aria-label="Close zoom"
          >
            <X className="w-5 h-5" />
          </motion.button>

          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="max-h-[90vh] max-w-[90vw] p-2 relative"
          >
            {/* Left arrow */}
            <button
              onClick={() => scrollByFraction('left')}
              aria-label="Scroll left"
              className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition ${
                canScrollLeft ? '' : 'opacity-40 pointer-events-none'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Right arrow */}
            <button
              onClick={() => scrollByFraction('right')}
              aria-label="Scroll right"
              className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition ${
                canScrollRight ? '' : 'opacity-40 pointer-events-none'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
              </svg>
            </button>

            {/* DEV: toggle to force image actual width (helps test overflow) */}
            <div className="absolute left-4 top-4 z-30">
              <label className="inline-flex items-center gap-2 text-xs text-white/90">
                <input
                  type="checkbox"
                  checked={forceActualWidth}
                  onChange={(e) => setForceActualWidth(e.target.checked)}
                  className="w-3 h-3"
                />
                <span className="select-none">Force actual width</span>
              </label>
            </div>

            {/* Scroll wrapper: use whitespace-nowrap and inline-block image so the image keeps its natural width */}
            <div
              ref={scrollerRef}
              className="overflow-x-auto overflow-y-hidden touch-pan-x rounded-2xl shadow-2xl whitespace-nowrap"
              style={{ WebkitOverflowScrolling: 'touch', maxHeight: '85vh' }}
            >
              <img
                ref={imgRef}
                src={src}
                alt={alt ?? 'Zoomed product image'}
                onLoad={onImageLoad}
                className="inline-block align-middle select-none"
                style={{
                  maxHeight: '85vh',
                  height: 'auto',
                  width: forceActualWidth ? 'auto' : 'auto',
                  display: 'inline-block',
                }}
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Gallery ---------------------------------------------------------------
function Gallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // safe guard: ensure at least one placeholder if array empty
  const safeImages = (images && images.length > 0) ? images : [''];

  return (
    <div className="space-y-4">
      {/* MAIN IMAGE: use aspect-[2/3] to match 1024x1536 uploads */}
      <div ref={containerRef} className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-gray-50">
        {safeImages[active] ? (
          <motion.img
            key={safeImages[active]}
            src={safeImages[active]}
            alt={`Product image ${active + 1}`}
            className="w-full h-full object-cover object-center transition-transform duration-500"
            initial={{ opacity: 0.6, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-sm text-muted-foreground">Image coming soon</div>
        )}

        <button
          onClick={() => setZoomOpen(true)}
          className="absolute bottom-3 right-3 rounded-full bg-white text-foreground shadow px-3 py-1.5 text-xs inline-flex items-center gap-1 hover:shadow-md"
          aria-label="Open zoom view"
        >
          <ZoomIn className="w-3.5 h-3.5" /> Zoom
        </button>

        <div className="absolute top-3 left-3 hidden sm:flex items-center gap-2">
          <span className="rounded-full bg-white/90 text-xs px-2 py-0.5">{active + 1}/{safeImages.length}</span>
        </div>
      </div>

      {/* THUMBNAILS: use background-image for consistent crop */}
      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {safeImages.map((src, i) => {
            const isActive = i === active;
            return (
              <button
                key={String(src) + i}
                onClick={() => setActive(i)}
                role="tab"
                aria-selected={isActive}
                className={`flex-shrink-0 rounded-xl overflow-hidden transition
                  ${isActive ? "ring-2 ring-emerald-500 border-transparent" : "border-border"}
                  w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-32 mt-1 ml-1`}
                title={`Image ${i + 1}`}
                style={{
                  backgroundImage: src ? `url(${src})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Hidden img for a11y and fallback (visually hidden) */}
                <span className="sr-only">{`Thumbnail ${i + 1}`}</span>
              </button>
            );
          })}
        </div>
      )}

      <ZoomModal open={zoomOpen} src={safeImages[active]} onClose={() => setZoomOpen(false)} alt={`Product image ${active + 1}`} />
    </div>
  );
}

// --- QuantitySelector (controlled) ----------------------------------------
export function QuantitySelector({
  quantity,
  setQuantity,
  min = 50,
  max = 10000,
}: {
  quantity: number;
  setQuantity: (n: number) => void;
  min?: number;
  max?: number;
}) {
  const increase = () => setQuantity(Math.min(quantity + 1, max));
  const decrease = () => setQuantity(Math.max(quantity - 1, min));

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={decrease}
        aria-label="Decrease quantity"
        className={`flex items-center justify-center w-9 h-9 rounded-md border text-lg font-semibold transition
          ${quantity > min ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"}`}
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="min-w-[3rem] text-center text-base font-medium select-none">{quantity}</span>

      <button
        onClick={increase}
        aria-label="Increase quantity"
        className="flex items-center justify-center w-9 h-9 rounded-md border text-lg font-semibold hover:bg-gray-100 transition"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
// --- Parsed Details with Collapsible Paragraphs ---------------------------
function ParsedDetails({ details }: { details: string[] }) {
  const specs = useMemo(() => {
    const kv: { k: string; v: string }[] = [];
    const rest: string[] = [];
    for (const d of details) {
      const idx = d.indexOf(':');
      if (idx > 0 && idx < 40) {
        const k = d.slice(0, idx).trim();
        const v = d.slice(idx + 1).trim();
        if (k && v) {
          kv.push({ k, v });
          continue;
        }
      }
      rest.push(d);
    }
    return { kv, rest };
  }, [details]);

  return (
    <div className="space-y-4">
      {specs.kv.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {specs.kv.map((s) => (
            <div key={s.k} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <div className="flex-none mt-0.5">
                <svg className="w-5 h-5 text-foreground/80" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.8" opacity="0.18" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{s.k}</div>
                <div className="text-sm font-medium text-foreground">{s.v}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {specs.rest.map((paragraph, idx) => (
          <CollapsibleParagraph key={idx} text={paragraph} />
        ))}
      </div>
    </div>
  );
}

function CollapsibleParagraph({ text, initialChars = 220 }: { text: string; initialChars?: number }) {
  const [open, setOpen] = useState(false);
  const isLong = text.length > initialChars;
  const preview = isLong ? text.slice(0, initialChars).trimEnd() + "…" : text;

  return (
    <div className="bg-white/5 p-3 rounded-lg">
      <motion.div
        key={open ? 'open' : 'closed'}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">{open ? text : preview}</p>

        {isLong && (
          <button
            onClick={() => setOpen(!open)}
            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline"
            aria-expanded={open}
          >
            <span>{open ? 'Show less' : 'Read more'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      </motion.div>
    </div>
  );
}

function TabTrigger({ value, active, onSelect, icon, label }: {
  value: string;
  active: boolean;
  onSelect: () => void;
  icon?: React.ReactNode;
  label: string;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onSelect}
      className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition
        ${active ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:bg-white/5"}`}
    >
      {icon}
      <span>{label}</span>
      {active && <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full shadow" />}
    </button>
  );
}

function EnhancedTabs({ product }: { product: any }) {
  const [active, setActive] = useState<'details' | 'care'>('details');

  return (
    <div className="w-full">
      <div className="relative">
        <div className="items-center gap-3 bg-muted/10 rounded-full p-1 inline-flex">
          <TabTrigger
            value="details"
            active={active === 'details'}
            onSelect={() => setActive('details')}
            icon={<Info className="w-4 h-4" />}
            label="Details"
          />
          <TabTrigger
            value="care"
            active={active === 'care'}
            onSelect={() => setActive('care')}
            icon={<Leaf className="w-4 h-4" />}
            label="Care Instructions"
          />
        </div>
      </div>

      <div className="mt-4">
        <AnimatePresence initial={false} mode="wait">
          {active === 'details' ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <ParsedDetails details={product.details} />
            </motion.div>
          ) : (
            <motion.div
              key="care"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <div className="space-y-3">
                {product.careInstructions.map((inst: string, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-start gap-3">
                      <div className="flex-none mt-0.5">
                        <Leaf className="w-5 h-5 text-foreground/80" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{inst}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Product Detail (page) -------------------------------------------------
const ProductDetail = () => {
  const { id } = useParams();
  const product = productData[id || ''];
  const { toast } = useToast();
  const { toggle, has } = useWishlist();

  // initial quantity 50 and parent-controlled
  const [quantity, setQuantity] = useState<number>(50);
  const [selectedSize, setSelectedSize] = useState<string | null>(product?.sizes?.[0] ?? null);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Product Not Found</h1>
            <p className="text-muted-foreground mt-2">The product you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ----- SEO: product + breadcrumb JSON-LD (added only) --------------------
  const canonical = `https://www.nextuniform.com/product/${product.id}`;
  const absoluteImages = (product.images || []).map((img) =>
    img && String(img).startsWith('http') ? img : `https://www.nextuniform.com${String(img).startsWith('/') ? '' : '/'}${img}`
  );

  const aggregateRating = (product.rating && product.reviews) ? {
    "@type": "AggregateRating",
    "ratingValue": Number(product.rating?.toFixed?.(1) ?? product.rating),
    "reviewCount": Number(product.reviews ?? 0)
  } : undefined;

  const productSchema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": absoluteImages,
    "description": (product.description || []).join(' '),
    "sku": product.id,
    "brand": {
      "@type": "Organization",
      "name": "Next Uniform",
      "url": "https://www.nextuniform.com"
    },
    "offers": {
      "@type": "Offer",
      "url": canonical,
      "priceCurrency": "INR",
      "price": String(product.price),
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    ...(aggregateRating ? { aggregateRating } : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.nextuniform.com/" },
      { "@type": "ListItem", "position": 2, "name": product.category || "Products", "item": `https://www.nextuniform.com/products?category=${encodeURIComponent(product.category || 'Products')}` },
      { "@type": "ListItem", "position": 3, "name": product.name, "item": canonical }
    ]
  };
  // -------------------------------------------------------------------------

  const waLink = buildWhatsAppLink({
    id: id || "",
    name: product.name,
    price: product.price,
    quantity,
    size: selectedSize,
    moq: product.moq,
  });

  const inWL = has(id ?? "");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* === SEO component (only addition) === */}
      <SEO
        title={`${product.name} — Next Uniform`}
        description={((product.description || [])[0] ?? product.name).slice(0, 160)}
        canonical={canonical}
        image={absoluteImages[0]}
        jsonLd={[productSchema, breadcrumbSchema]}
      />
      {/* ==================================== */}

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Responsive grid: single column on small, two columns on large */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: gallery (will remain full width of column) */}
          <div className="w-full">
            <Gallery images={product.images ?? []} />
          </div>

          {/* Right: info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.isNew && <Badge variant="secondary" className="bg-accent text-accent-foreground">New</Badge>}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
              </div>

              <div className="mb-4">
                <div className="text-2xl font-semibold text-foreground">₹{product.price}</div>
              </div>

              <div className="text-muted-foreground space-y-2 mb-4">
                {product.description.map((d) => <p key={d}>{d}</p>)}
              </div>
            </div>

            {/* Size */}
            {product.sizes && (
              <div>
                <h3 className="font-medium text-foreground mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const active = selectedSize === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-2 rounded-md border text-sm transition ${active ? "bg-accent/10 border-accent" : "border-border hover:border-foreground"}`}
                        aria-pressed={active}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-medium text-foreground mb-2">Quantity</h3>
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} min={50} />
              <p className="text-xs text-muted-foreground mt-2">Minimum order quantity is 50.</p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 text-white px-4 py-3 text-base font-medium hover:bg-emerald-700 active:scale-[.99] transition"
                aria-label={`Chat about ${product.name} on WhatsApp`}
              >
                <WhatsAppIcon className="w-5 h-5" />
                Chat on WhatsApp
              </a>

              {/* On small screens, buttons stack; on md+ they sit inline */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const safeId = id ?? "";
                    const already = has(safeId);

                    toggle({
                      id: safeId,
                      name: product.name,
                      price: product.price,
                      image: product.images?.[0],
                      category: product.category,
                      subcategory: product.subcategory,
                      moq: product.moq,
                      quantity: undefined
                    });

                    toast({
                      title: already ? "Removed from Wishlist 💔" : "Added to Wishlist ❤️",
                      description: already ? `${product.name} has been removed.` : `${product.name} has been added to your wishlist.`,
                    });
                  }}
                  className={`flex-1 inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition
                    ${inWL ? "bg-accent text-accent-foreground border-accent" : "bg-white text-foreground border-border"}`}
                  aria-pressed={inWL}
                >
                  <FolderHeart className="w-4 h-4" />
                  <span className="truncate">{inWL ? "Added to Wishlist" : "Add to Wishlist"}</span>
                </button>

                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    const shareUrl = `${window.location.origin}/product/${id}`;
                    const title = product.name;
                    const text = `Check out this product: ${product.name}`;

                    if ((navigator as any).share) {
                      try {
                        await (navigator as any).share({ title, text, url: shareUrl });
                        toast({ title: "Shared successfully" });
                      } catch {
                        /* cancelled */
                      }
                    } else {
                      try {
                        await navigator.clipboard.writeText(shareUrl);
                        toast({ title: "Link copied to clipboard" });
                      } catch {
                        toast({ title: "Unable to copy link", variant: "destructive" });
                      }
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium bg-white text-foreground border-border"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="truncate">Share</span>
                </button>
              </div>
            </div>

            <Separator />

            {/* Tabs */}
            <EnhancedTabs product={product} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;