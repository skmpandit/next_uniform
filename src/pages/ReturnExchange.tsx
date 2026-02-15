import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Package, RotateCcw, Truck, HelpCircle } from "lucide-react";
import SEO from "@/components/SEO"; // <-- added

export default function ReturnsExchanges() {
  const [form, setForm] = useState({
    orderId: "",
    email: "",
    requestType: "exchange", // "exchange" | "return"
    items: "",
    reason: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hook up to backend / email
    console.log("RMA request:", form);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  };

  // SEO JSON-LD (only addition)
  const canonical = `${typeof window !== "undefined" ? window.location.origin : "https://www.nextuniform.com"}/returns`;
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Returns & Exchanges — Next Uniform",
    description:
      "Start a return or exchange for Next Uniform orders. Read our return/exchange policy, steps, and FAQs. Fast support for bulk and retail orders across India.",
    url: canonical,
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", url: "https://www.nextuniform.com" },
    potentialAction: {
      "@type": "ContactAction",
      target: canonical,
      name: "Request return or exchange"
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
      telephone: "+91-9674984559",
      contactType: "sales",
      areaServed: "IN",
      email: "admin@nextuniform.com"
    }]
  };
  // end SEO JSON-LD

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* SEO component added (no UI changes) */}
      <SEO
        title="Returns & Exchanges — Next Uniform"
        description="Start a return or exchange for Next Uniform orders. Read our return/exchange policy, steps and FAQs. Fast support for bulk and retail orders across India."
        canonical={canonical}
        image="https://www.nextuniform.com/og-image.jpg"
        jsonLd={[webpageSchema, orgSchema]}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Returns & Exchanges</h1>
            <p className="text-muted-foreground">
              Not quite right? No worries. Request a return or exchange below and we’ll make it easy.
            </p>
          </div>
          <Badge variant="secondary" className="rounded-full">NextUniform Care</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Main Column */}
          <div className="space-y-8">
            {/* Quick steps */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-semibold mb-4">How it works</h2>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 font-medium">
                    <RotateCcw className="w-4 h-4" /> 1) Request
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Submit your order details and choose an exchange or return.
                  </p>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 font-medium">
                    <Package className="w-4 h-4" /> 2) Pack
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Keep items unused, unwashed, with original tags & packaging.
                  </p>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 font-medium">
                    <Truck className="w-4 h-4" /> 3) Ship / Pickup
                  </div>
                  <p className="text-muted-foreground mt-2">
                    We’ll provide shipping instructions or arrange pickup (where available).
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Tabs */}
            <Tabs defaultValue="exchange" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="exchange">Exchanges</TabsTrigger>
                <TabsTrigger value="return">Returns</TabsTrigger>
                <TabsTrigger value="policy">Full Policy</TabsTrigger>
              </TabsList>

              <TabsContent value="exchange" className="space-y-4">
                <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                  <h3 className="font-semibold">Exchange Policy</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Request within <strong>7 days</strong> of delivery.</li>
                    <li>Item must be <strong>unused, unwashed, with original tags & packaging</strong>.</li>
                    <li>One free size exchange per item (within India). Further exchanges may incur shipping.</li>
                    <li>Customized/embroidered/altered items aren’t eligible (except manufacturing defects).</li>
                    <li>Replacement is shipped after the returned item passes quality check (QC).</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="return" className="space-y-4">
                <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                  <h3 className="font-semibold">Return Policy</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Request within <strong>7 days</strong> of delivery.</li>
                    <li>Refunds to original payment method within <strong>5–7 business days</strong> post-QC.</li>
                    <li>Shipping fees are <strong>non-refundable</strong> (unless item is defective/wrong).</li>
                    <li>Not returnable: customized/altered items, used/worn items, hygiene-sensitive items, final-sale.</li>
                    <li>Defects/Wrong item? We’ll replace/refund at no cost.</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="policy" className="space-y-4">
                <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                  <h3 className="font-semibold">Full Terms</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>QC failures (stains, odor, wear, missing tags) will be returned to sender.</li>
                    <li>International orders: customer covers return shipping unless defective/wrong item.</li>
                    <li>For bulk/corporate orders, exchanges depend on inventory availability.</li>
                    <li>Refund timeline may vary per payment provider/bank.</li>
                    <li>For any support: <a href="mailto:support@nextuniform.com" className="underline">support@nextuniform.com</a></li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>

            {/* FAQ */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4" />
                <h3 className="font-semibold">FAQ</h3>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="when-refund">
                  <AccordionTrigger>When will I receive my refund?</AccordionTrigger>
                  <AccordionContent>
                    We start processing after QC approval. Refunds usually reflect within 5–7 business days,
                    depending on your bank or payment provider.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="how-exchange-works">
                  <AccordionTrigger>How do exchanges ship?</AccordionTrigger>
                  <AccordionContent>
                    We ship the replacement once your original item passes QC. You’ll receive tracking via email/SMS.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="custom-orders">
                  <AccordionTrigger>Are customized uniforms returnable?</AccordionTrigger>
                  <AccordionContent>
                    Customized, embroidered, or altered items are not eligible unless there’s a manufacturing defect or the wrong item was delivered.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Sidebar: Start a Request */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-semibold">Start a Return/Exchange</h3>
              </div>

              <form className="space-y-3" onSubmit={onSubmit}>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((s) => ({ ...s, requestType: "exchange" }))}
                    className={`px-3 py-2 rounded-md border text-sm ${
                      form.requestType === "exchange"
                        ? "border-accent bg-accent/10"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    Exchange
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((s) => ({ ...s, requestType: "return" }))}
                    className={`px-3 py-2 rounded-md border text-sm ${
                      form.requestType === "return"
                        ? "border-accent bg-accent/10"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    Return
                  </button>
                </div>

                <Input
                  required
                  placeholder="Order ID"
                  value={form.orderId}
                  onChange={(e) => setForm((s) => ({ ...s, orderId: e.target.value }))}
                />
                <Input
                  type="email"
                  required
                  placeholder="Email used at purchase"
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                />
                <Textarea
                  placeholder="Which item(s) and size? What’s the issue?"
                  value={form.items}
                  onChange={(e) => setForm((s) => ({ ...s, items: e.target.value }))}
                />
                <Textarea
                  placeholder="Reason (fit, color, defect, etc.)"
                  value={form.reason}
                  onChange={(e) => setForm((s) => ({ ...s, reason: e.target.value }))}
                />

                <Button className="w-full" type="submit">Submit Request</Button>
                {submitted && (
                  <p className="text-xs text-emerald-600">
                    Thanks! We’ve received your request. You’ll get next steps by email.
                  </p>
                )}
              </form>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 text-sm">
              <p className="font-medium mb-2">Questions?</p>
              <p className="text-muted-foreground">
                Email <a className="underline" href="mailto:support@nextuniform.com">support@nextuniform.com</a><br />
                Mon–Fri, 10:00–18:00 IST
              </p>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}