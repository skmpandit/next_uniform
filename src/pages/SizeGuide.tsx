import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import SEO from "@/components/SEO"; // <-- added

// --- Helpers -----------------------------------------------------------------
const CM_PER_INCH = 2.54;
const toInch = (cm: number) => +(cm / CM_PER_INCH).toFixed(1);

type Unit = "cm" | "in";

// Renders a number in cm or inch
const U = ({ value, unit }: { value: number; unit: Unit }) => (
  <>{unit === "cm" ? value : toInch(value)}</>
);

// --- Sample data (adjust to your brand) --------------------------------------
type Row = Record<string, number | string>;

const WOMEN_TOPS: Row[] = [
  { Size: "XS", Bust: 82, Waist: 66, Hip: 90, Length: 85 },
  { Size: "S",  Bust: 88, Waist: 72, Hip: 96, Length: 86 },
  { Size: "M",  Bust: 94, Waist: 78, Hip: 102, Length: 87 },
  { Size: "L",  Bust: 100, Waist: 84, Hip: 108, Length: 88 },
  { Size: "XL", Bust: 106, Waist: 90, Hip: 114, Length: 89 },
  { Size: "XXL", Bust: 112, Waist: 96, Hip: 120, Length: 90 },
];

const MEN_SHIRTS: Row[] = [
  { Size: "S",  Chest: 96,  Shoulder: 43, Length: 68 },
  { Size: "M",  Chest: 100, Shoulder: 45, Length: 70 },
  { Size: "L",  Chest: 104, Shoulder: 47, Length: 72 },
  { Size: "XL", Chest: 108, Shoulder: 49, Length: 74 },
  { Size: "XXL",Chest: 112, Shoulder: 51, Length: 76 },
];

const BOTTOMS: Row[] = [
  { Size: "28", Waist: 71,  Hip: 94,  Inseam: 80 },
  { Size: "30", Waist: 76,  Hip: 99,  Inseam: 81 },
  { Size: "32", Waist: 81,  Hip: 104, Inseam: 82 },
  { Size: "34", Waist: 86,  Hip: 109, Inseam: 82 },
  { Size: "36", Waist: 91,  Hip: 114, Inseam: 83 },
  { Size: "38", Waist: 96,  Hip: 119, Inseam: 83 },
];

// Columns to treat as measurements (convertible). Non-listed columns shown as is.
const WOMEN_TOPS_MEAS = ["Bust", "Waist", "Hip", "Length"] as const;
const MEN_SHIRTS_MEAS = ["Chest", "Shoulder", "Length"] as const;
const BOTTOMS_MEAS = ["Waist", "Hip", "Inseam"] as const;

// --- Reusable Table ----------------------------------------------------------
function SizeTable<T extends string>({
  title,
  rows,
  measCols,
  unit,
}: {
  title: string;
  rows: Row[];
  measCols: readonly T[];
  unit: Unit;
}) {
  const cols = useMemo(() => Object.keys(rows[0] || {}), [rows]);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border/60 flex items-center gap-2">
        <Badge variant="secondary" className="rounded-full">NextUniform</Badge>
        <h3 className="font-semibold">{title}</h3>
        <span className="ml-auto text-sm text-muted-foreground">Units: {unit.toUpperCase()}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-foreground">
            <tr>
              {cols.map((c) => (
                <th key={c} className="px-4 py-3 text-left font-medium whitespace-nowrap">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className="border-t border-border/60 hover:bg-muted/30 transition-colors"
              >
                {cols.map((c) => {
                  const val = r[c];
                  const isMeas = (measCols as readonly string[]).includes(c);
                  return (
                    <td key={c} className="px-4 py-3 whitespace-nowrap">
                      {typeof val === "number" && isMeas ? (
                        <>
                          <U value={val} unit={unit} />{" "}
                          <span className="text-muted-foreground">{unit}</span>
                        </>
                      ) : (
                        <>{val}</>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- How to Measure ----------------------------------------------------------
function HowToMeasure() {
  const items = [
    {
      k: "Chest / Bust",
      v: "Measure around the fullest part, under arms, tape level and snug (not tight).",
    },
    {
      k: "Waist",
      v: "Measure around your natural waistline — the narrowest part of the torso.",
    },
    {
      k: "Hip",
      v: "With feet together, measure around the fullest part of hips/seat.",
    },
    {
      k: "Shoulder",
      v: "Across back from shoulder seam to shoulder seam.",
    },
    {
      k: "Sleeve",
      v: "From shoulder point down to wrist (follow natural bend).",
    },
    {
      k: "Inseam",
      v: "From crotch seam to bottom of ankle hem.",
    },
  ];
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-start gap-2">
        <Info className="w-5 h-5 text-accent mt-0.5" />
        <div>
          <h3 className="font-semibold">How to Measure</h3>
          <p className="text-sm text-muted-foreground">
            Stand upright, keep the tape parallel to the floor, and measure over light clothing.
          </p>
        </div>
      </div>
      <ul className="grid sm:grid-cols-2 gap-3 text-sm">
        {items.map((it) => (
          <li key={it.k} className="p-3 rounded-xl bg-muted/40">
            <span className="font-medium">{it.k}:</span>{" "}
            <span className="text-muted-foreground">{it.v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Page --------------------------------------------------------------------
export default function SizeGuide() {
  const [unit, setUnit] = useState<Unit>("cm");

  // --- SEO (only addition) --------------------------------------------------
  const canonical = `${typeof window !== "undefined" ? window.location.origin : "https://www.nextuniform.com"}/sizeguide`;
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Size Guide — Next Uniform",
    description: "Size guide for Next Uniform — measurement charts for women, men, and bottoms. Toggle between CM and IN and find fitting tips for uniforms and workwear.",
    url: canonical,
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", url: "https://www.nextuniform.com" },
  };
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Next Uniform",
    url: "https://www.nextuniform.com",
    logo: "https://www.nextuniform.com/logo.png",
    contactPoint: [{
      "@type": "ContactPoint",
      telephone: "+91-9674984559",
      contactType: "sales",
      areaServed: "IN",
      email: "admin@nextuniform.com"
    }]
  };
  // -------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* SEO component (no UI changes) */}
      <SEO
        title="Size Guide — Next Uniform"
        description="Find your perfect NextUniform fit — measurement charts for women, men and bottoms. Toggle between CM and IN and read fit tips for uniforms and workwear."
        canonical={canonical}
        image="https://www.nextuniform.com/og-image.jpg"
        jsonLd={[webpageSchema, orgSchema]}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Size Guide</h1>
            <p className="text-muted-foreground">
              Find your perfect NextUniform fit. Use the unit toggle and charts below.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Units</span>
            <div className="inline-flex rounded-lg border border-border overflow-hidden">
              <Button
                variant={unit === "cm" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setUnit("cm")}
              >
                CM
              </Button>
              <Button
                variant={unit === "in" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setUnit("in")}
              >
                IN
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Left: Tabs + Tables */}
          <div className="space-y-6">
            <Tabs defaultValue="women">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="women">Women</TabsTrigger>
                <TabsTrigger value="men">Men</TabsTrigger>
                <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
              </TabsList>

              <TabsContent value="women" className="space-y-6">
                <SizeTable title="Women’s Tops / Dresses" rows={WOMEN_TOPS} measCols={WOMEN_TOPS_MEAS} unit={unit} />
              </TabsContent>

              <TabsContent value="men" className="space-y-6">
                <SizeTable title="Men’s Shirts / T-Shirts" rows={MEN_SHIRTS} measCols={MEN_SHIRTS_MEAS} unit={unit} />
              </TabsContent>

              <TabsContent value="bottoms" className="space-y-6">
                <SizeTable title="Pants / Bottoms (Unisex)" rows={BOTTOMS} measCols={BOTTOMS_MEAS} unit={unit} />
              </TabsContent>
            </Tabs>

            <HowToMeasure />

            {/* Fit tips */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold mb-2">Fit Tips</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Between sizes? For a relaxed look, size up; for tailored, size down.</li>
                <li>Workwear/Uniforms: allow room for layering and movement.</li>
                <li>Fabric shrinkage: cottons may shrink up to 3–5% after first wash.</li>
              </ul>
            </div>
          </div>

          {/* Right: Quick Nav / Help */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <nav className="grid gap-2 text-sm">
                <a href="#women" onClick={(e) => e.preventDefault()} className="text-primary hover:underline">
                  Women’s Tops / Dresses
                </a>
                <a href="#men" onClick={(e) => e.preventDefault()} className="text-primary hover:underline">
                  Men’s Shirts / T-Shirts
                </a>
                <a href="#bottoms" onClick={(e) => e.preventDefault()} className="text-primary hover:underline">
                  Pants / Bottoms
                </a>
              </nav>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                Not sure about your size? Contact us and we’ll recommend the best fit based on your measurements.
              </p>
              <a href="/contact" className="mt-3 inline-flex text-sm text-primary underline">
                Contact Support →
              </a>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}