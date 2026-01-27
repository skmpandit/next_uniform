import { useEffect, useMemo, useRef, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { productData } from "@/data/product";
import { Link, useLocation, useNavigate } from "react-router-dom";

const allProducts = Object.values(productData);
const norm = (v = "") => v.toLowerCase().trim();


function scoreProduct(p, q) {
  const name = norm(p.name);
  let score = 0;
  if (name === q) score += 120;
  if (name.startsWith(q)) score += 80;
  if (name.includes(q)) score += 50;
  const cat = norm(p.category), sub = norm(p.subcategory);
  if (cat.includes(q)) score += 20;
  if (sub.includes(q)) score += 20;
  if (p.isNew) score += 5;
  return score;
}


function formatINR(v) {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
  } catch {
    return `₹${v}`;
  }
}

function ProductCard({ p, highlight }) {
// optional: highlight matched text in name
  const q = norm(highlight);
  const name = p.name;
  const idx = q ? norm(name).indexOf(q) : -1;
  let title = name;
  if (idx >= 0) {
    title = (
      <>
        {name.slice(0, idx)}
        <mark className="bg-yellow-200 px-0.5 rounded">{name.slice(idx, idx + q.length)}</mark>
        {name.slice(idx + q.length)}
      </>
    );
}


return (
  <Link to={`/product/${p.id}`} className="group rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm hover:shadow-md transition-all">
    <div className="aspect-[4/3] bg-muted overflow-hidden">
      <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
    </div>
    <div className="p-4">
      <div className="text-sm text-muted-foreground mb-1">{p.category}{p.subcategory ? ` · ${p.subcategory}` : ""}</div>
      <h3 className="font-semibold text-foreground mb-1 leading-snug">{title}</h3>
      <div className="flex items-center justify-between mt-2">
        <span className="text-base font-semibold">{formatINR(p.price)}</span>
        {p.isNew && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700">New</span>}
      </div>
    </div>
  </Link>
);
}



const Search = () => {

  const [inputValue, setInputValue] = useState("");
  const q = norm(inputValue);


  const results = useMemo(() => {
    if (!q) return [];
    return allProducts
      .map((p) => ({ p, score: scoreProduct(p, q) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || a.p.price - b.p.price)
      .map((x) => x.p);
  }, [q]);

  return (
    <div className="min-h-screen bg-background">
      <Header/>
      <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="text-center mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Search</h1>
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><SearchIcon width={20} /></div>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by product name, category or subcategory..."
            className="w-full pl-9 pr-10 py-3 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {inputValue && (
            <button
            onClick={() => setInputValue("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            ✕
          </button>
          )}
        </div>
      </div>


        {q ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Results for “{inputValue.trim()}”</h2>
              <span className="text-sm text-muted-foreground">{results.length} result{results.length !== 1 ? "s" : ""}</span>
            </div>
              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((p) => (
                  <ProductCard key={p.id} p={p} highlight={q} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-2">
                  <p className="text-muted-foreground">No products found for “{inputValue.trim()}”.</p>
                  <p className="text-sm text-muted-foreground">Try a different keyword like <span className="font-medium">Scrub</span> or <span className="font-medium">Boiler Suit</span>.</p>
                </div>
              )}
          </>
        ) : (
        <div className="text-center text-muted-foreground py-12">Start typing to search…</div>
        )}
        </div>


      {/* Browse link */}
        <div className="mt-8 mb-8 text-center">
          <Link to="/products" className="text-sm text-primary underline">
            Browse all products →
          </Link>
        </div>
      <Footer />
    </div>
  );
};

export default Search;