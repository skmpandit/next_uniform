import { useEffect, useMemo, useState } from 'react';
import { Filter, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { productData } from '@/data/product'
import { useLocation, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO'; // <-- ADDED

const norm = (v?: string) => (v ?? '').trim().toLowerCase();

const setSearchParams = (
  navigate: ReturnType<typeof useNavigate>,
  basePath: string,
  params: Record<string, string | number | undefined | null>
) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).length > 0) sp.set(k, String(v));
  });
  const q = sp.toString();
  navigate(q ? `${basePath}?${q}` : basePath, { replace: true });
};

const getResponsivePageSize = () => {
  if (typeof window === 'undefined') return 8;
  const width = window.innerWidth;
  if (width < 640) return 6;
  if (width < 1024) return 8;
  if (width < 1440) return 10;
  return 12;
};

const Products = () => {

  const formatINR = (v: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,   // or 2 if you want paise
    }).format(v);
  
  // ---- Read URL params ------------------------------------------------------
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const paramCategoryRaw = params.get('category') || '';
  const paramCategories = paramCategoryRaw ? paramCategoryRaw.split(",").map(s => s.trim()).filter(Boolean) : []
  const paramSubcat  = params.get('subcategory') || undefined;
  const paramMin     = params.get('min') ? Number(params.get('min')) : undefined;
  const paramMax     = params.get('max') ? Number(params.get('max')) : undefined;
  const paramSort    = (params.get('sort') as 'featured'|'price-low'|'price-high'|'name') || 'featured';
  const paramView    = (params.get('view') as 'grid'|'list') || 'grid';
  const paramPage    = params.get('page') ? Math.max(1, Number(params.get('page'))) : 1;

  // ---- Data & derived values ------------------------------------------------
  const allProducts = useMemo(() => Object.values(productData), []);
  const categories = useMemo(
    () => Array.from(new Set(allProducts.map(p => p.category).filter(Boolean))) as string[],
    [allProducts]
  );
  const maxPrice = useMemo(
    () => Math.max(0, ...allProducts.map(p => Number(p.price) || 0)),
    [allProducts]
  );

  // ---- UI state (seeded from URL) ------------------------------------------
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(paramView);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    paramMin ?? 0,
    paramMax ?? Math.ceil(maxPrice || 200),
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(paramCategories);
  const [sortBy, setSortBy] = useState<'featured'|'price-low'|'price-high'|'name'>(paramSort);
  const [page, setPage] = useState<number>(paramPage);
  const [pageSize, setPageSize] = useState<number>(() => getResponsivePageSize());

  // ---- Push state to URL (persist filters) ---------------------------------
  useEffect(() => {
    setSearchParams(navigate, '/products', {
      category: selectedCategories.length > 0 ? selectedCategories.join(",") : undefined,
      subcategory: paramSubcat, // keep subcat from header nav if present
      min: priceRange[0] > 0 ? priceRange[0] : undefined,
      max: priceRange[1] < Math.ceil(maxPrice || 200) ? priceRange[1] : undefined,
      sort: sortBy !== 'featured' ? sortBy : undefined,
      view: viewMode !== 'grid' ? viewMode : undefined,
      page: page > 1 ? page : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, priceRange, sortBy, viewMode, page, maxPrice]);

  // ---- Scroll to top on query change (nice UX) ------------------------------
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.search]);

  // ---- Guards for bad params ------------------------------------------------
  const knownCategory = paramCategories.length ? paramCategories.every(c => categories.includes(c)) : true;
  const hasValidSubcategory = useMemo(() => {
    if (!paramSubcat) return true;
    const subset = allProducts.filter(p =>
      (paramCategories.length === 0 || (p.category && paramCategories.includes(p.category))) &&
      norm(p.subcategory) === norm(paramSubcat)
    );
    return subset.length > 0;
  }, [allProducts, paramCategories, paramSubcat]);
  const invalidParams = !knownCategory || !hasValidSubcategory;

  // ---- Filtering (price & category; subcategory from URL) -------------------
  const filteredProducts = allProducts.filter(product => {
    // price uses product.price only (no salePrice)
    const price = product.price;
    if (price < priceRange[0] || price > priceRange[1]) return false;

    // categories from state (pre-seeded from URL category)
    if (selectedCategories.length > 0) {
      if (!product.category || !selectedCategories.includes(product.category)) return false;
    }

    // subcategory enforced from URL if present
    if (paramSubcat && norm(product.subcategory) !== norm(paramSubcat)) return false;

    return true;
  });

  // ---- Sorting (by product.price or name) -----------------------------------
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0; // featured
    }
  });

  // ---- Pagination -----------------------------------------------------------
  const total = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageSafe = Math.min(Math.max(1, page), totalPages);
  const paginated = sortedProducts.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  const loadMore = () => {
    if (pageSafe < totalPages) setPage(pageSafe + 1);
  };

  useEffect(() => {
    const handleResize = () => {
      const nextSize = getResponsivePageSize();
      setPageSize(prev => {
        if (prev === nextSize) return prev;
        setPage(1);
        return nextSize;
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ---- Helpers --------------------------------------------------------------
  const hasActiveURLFilter = paramCategories.length > 0 || Boolean(paramSubcat);
  const hasAnyFilter =
    hasActiveURLFilter ||
    selectedCategories.length > 0 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== Math.ceil(maxPrice || 200) ||
    sortBy !== 'featured';

  const clearAllAndViewAll = () => {
    navigate('/products', { replace: true });
    setSelectedCategories([]);
    setPriceRange([0, Math.ceil(maxPrice || 200)]);
    setSortBy('featured');
    setPage(1);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
    setPage(1);
  };

  // ---- Filters panel --------------------------------------------------------
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-medium text-foreground mb-3">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={(v) => { setPriceRange([v[0], v[1]] as [number, number]); setPage(1); }}
          max={Math.ceil(maxPrice || 200)}
          min={0}
          step={50}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>{formatINR(priceRange[0])}</span>
          <span>{formatINR(priceRange[1])}</span>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-medium text-foreground mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <label htmlFor={category} className="text-sm text-foreground cursor-pointer">
                {category}
              </label>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground">No categories in data yet.</p>
          )}
        </div>
      </div>
    </div>
  );

  // --- Pull-from-URL sync (add this after param* declarations) ---
  useEffect(() => {
    // keep category checkbox in sync with URL
    setSelectedCategories(paramCategories);

    // optional: reset related UI when navigating via header links
    setPage(1);
    // if you want price & sort reset on category change, uncomment these:
    // setPriceRange([paramMin ?? 0, Math.ceil(maxPrice || 200)]);
    // setSortBy('featured');
    // setViewMode('grid');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramCategoryRaw, paramSubcat]);  // run whenever header changes category/subcategory

  // ----------------- SEO JSON-LD for products page (ONLY ADDITION) ------------
  const canonical = `${window.location.origin}/products${location.search || ''}`;

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": paramCategories.length > 0 ? `Products — ${paramCategories.join(', ')} — Next Uniform` : "Products — Next Uniform",
    "description": paramSubcat
      ? `Products — ${paramCategories.join(', ')} / ${paramSubcat}. Browse industrial, hospital, hotel and corporate uniforms from Next Uniform.`
      : "Browse industrial, hospital, hotel and corporate uniforms from Next Uniform. Bulk orders and custom branding available PAN India.",
    "url": canonical,
    "inLanguage": "en-IN",
    "isPartOf": { "@type": "WebSite", "url": "https://www.nextuniform.com" }
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Products",
    "url": canonical,
    "itemListElement": paginated.map((p, idx) => ({
      "@type": "ListItem",
      "position": idx + 1 + (pageSafe - 1) * pageSize,
      "url": `https://www.nextuniform.com/product/${p.id}`,
      "name": p.name
    }))
  };
  // -------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* === SEO component (only addition) === */}
      <SEO
        title={paramCategories.length > 0 ? `Products — ${paramCategories.join(', ')} — Next Uniform` : 'All Products — Next Uniform'}
        description={webpageSchema.description}
        canonical={canonical}
        image="https://www.nextuniform.com/og-image.jpg"
        jsonLd={[webpageSchema, itemListSchema]}
      />
      {/* ==================================== */}

      <div className="container mx-auto px-4 py-8">
        {/* Header Row: Title + View All button when filtered */}
        <div className="mb-6 flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">All Products</h1>
            <p className="text-muted-foreground">
              {paramCategories.length > 0 ? (
                <>
                  Showing:&nbsp;
                  <strong>{paramCategories.join(', ')}</strong>
                  {paramSubcat ? (
                    <>
                      &nbsp;/&nbsp;<strong>{paramSubcat}</strong>
                    </>
                  ) : null}
                </>
              ) : (
                'Discover our complete collection'
              )}
            </p>
          </div>

          {hasAnyFilter && (
            <Button variant="outline" onClick={clearAllAndViewAll}>
              View all products
            </Button>
          )}
        </div>

        {/* Breadcrumb + Active filter chips */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="text-sm text-muted-foreground">
            <span className="hover:underline">
              <Link to="/products" onClick={clearAllAndViewAll}>
                All Products
              </Link>
            </span>
            {paramCategories.length > 0 && (
              <>
                {' / '}
                {paramCategories.map((cat, i) => (
                  <span key={cat} className='text-foreground font-medium'>
                    {cat}
                    {i < paramCategories.length - 1 ? ", " : ""}
                  </span>
                ))}
              </>
            )}
            {paramSubcat && (
              <>
                {' / '}<span className="text-foreground font-medium">{paramSubcat}</span>
              </>
            )}
          </div>

          {(selectedCategories.length > 0 ||
            priceRange[0] > 0 ||
            priceRange[1] < Math.ceil(maxPrice || 200) ||
            sortBy !== 'featured' ||
            paramSubcat) && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllAndViewAll}
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {selectedCategories.map((c) => (
            <button
              key={c}
              className="px-2.5 py-1 text-sm rounded-full bg-muted hover:bg-muted/80"
              onClick={() => { setSelectedCategories(prev => prev.filter(x => x !== c)); setPage(1); }}
              title="Remove category"
            >
              {c} ✕
            </button>
          ))}
          {(priceRange[0] > 0 || priceRange[1] < Math.ceil(maxPrice || 200)) && (
            <button
              className="px-2.5 py-1 text-sm rounded-full bg-muted hover:bg-muted/80"
              onClick={() => { setPriceRange([0, Math.ceil(maxPrice || 200)]); setPage(1); }}
              title="Reset price"
            >
              ₹{priceRange[0]} - ₹{priceRange[1]} ✕
            </button>
          )}
          {paramSubcat && (
            <span
              className="px-2.5 py-1 text-sm rounded-full bg-muted cursor-default"
              title="From navigation"
            >
              {paramSubcat}
            </span>
          )}
        </div>

        {/* Invalid params guard */}
        {invalidParams && (
          <div className="mb-6 p-4 rounded-lg border border-border bg-card">
            <p className="text-foreground font-medium mb-1">We couldn’t find that category.</p>
            <p className="text-muted-foreground mb-3">Try exploring all products instead.</p>
            <Button onClick={clearAllAndViewAll}>
              View all products
            </Button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-card p-6 rounded-lg border border-border sticky top-24">
              <div className="flex items-center space-x-2 mb-4">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="font-semibold text-foreground">Filters</h2>
              </div>
              <FilterContent />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center space-x-4">
                {/* Mobile Filter Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>Filter products by price and category</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <Badge variant="secondary" className="text-sm">
                  {total} products
                </Badge>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort Dropdown */}
                <Select
                  value={sortBy}
                  onValueChange={(v) => { setSortBy(v as typeof sortBy); setPage(1); }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex border border-border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {paginated.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    images={product.images ?? []}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {paginated.map((product) => (
                  <div key={product.id} className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg font-semibold text-foreground">₹{product.price}</span>
                      </div>
                      <Link to={`/product/${product.id}`}>
                        <Button size="sm" className="mt-2">View Details</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination controls */}
            {total > 0 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pageSafe <= 1}
                  onClick={() => setPage(pageSafe - 1)}
                >
                  Prev
                </Button>
                <span className="text-sm">Page {pageSafe} of {totalPages}</span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pageSafe >= totalPages}
                  onClick={() => setPage(pageSafe + 1)}
                >
                  Next
                </Button>
              </div>
            )}

            {/* No Results */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or click “View all products”.</p>
                <Button onClick={clearAllAndViewAll} className="mt-3">View all products</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;