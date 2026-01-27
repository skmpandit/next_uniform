import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const faqs = [
  {
    q: 'What is Next Uniform?',
    a: `Next Uniform is a B2B supplier of uniforms and workwear serving industries, hotels, hospitals and corporate clients across India.
        We handle bulk orders, custom branding (logos/embroidery/printing) and PAN India delivery.`,
  },
  {
    q: 'How do I request a quote for bulk orders?',
    a: `Use the Contact page to submit product names, estimated quantities (MOQ), delivery city and desired timeline.
        You can also call our sales team at +91 96740 84559 or email sales@nextuniform.com for faster assistance.`,
  },
  {
    q: 'What are the minimum order quantities (MOQ)?',
    a: `MOQ depends on the product and customization requested. Typical MOQs start from 25–50 pieces per design. For exact MOQs, request a quote for the specific item and finishes.`,
  },
  {
    q: 'What is your lead time for bulk orders?',
    a: `Lead time depends on product, order quantity, and branding. Standard lead times range from 7–30 days after order confirmation. Rush production may be available for a fee—please discuss at the time of enquiry.`,
  },
  {
    q: 'Do you provide custom branding (logo embroidery / printing)?',
    a: `Yes — we offer embroidery, screen printing, and heat transfer. Provide your artwork (vector preferred) and we will share mockups and pricing.`,
  },
  {
    q: 'What is your return and exchange policy for bulk orders?',
    a: `For bulk orders, we carefully inspect goods before dispatch. Returns or replacements are handled for manufacturing defects or shipping damage—please report within 7 days of delivery and include photos. See our Returns & Exchanges page for details.`,
  },
];

const Faq: React.FC = () => {
  // Build FAQ JSON-LD for rich results
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <SEO
        title="FAQ — Next Uniform"
        description="Frequently asked questions about Next Uniform — bulk orders, MOQs, custom branding, lead times and returns. Contact our sales team for quotes."
        canonical="https://www.nextuniform.com/faq"
        image="https://www.nextuniform.com/og-image.jpg"
        jsonLd={[faqJsonLd]}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-4 lg:gap-10">
          {/* TOC (large screens) */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-28 h-fit self-start">
            <div className="rounded-xl border border-border bg-white dark:bg-neutral-900 p-4 shadow-sm">
              <h3 className="text-sm font-semibold mb-3">On this page</h3>
              <nav aria-label="FAQ navigation" className="text-sm space-y-2">
                {faqs.map((f, i) => (
                  <a
                    key={i}
                    href={`#faq-${i}`}
                    className="block text-muted-foreground hover:text-foreground"
                  >
                    {f.q.length > 60 ? f.q.slice(0, 57) + '...' : f.q}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="lg:col-span-3 space-y-6">
            <header className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Frequently Asked Questions (FAQ)</h1>
              <p className="text-sm text-muted-foreground">
                Answers to common questions about Next Uniform — bulk ordering, custom branding, MOQs, lead times, returns and support.
              </p>
            </header>

            <section className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <details
                    id={`faq-${idx}`}
                    key={idx}
                    className="group border border-border rounded-lg p-4"
                  >
                    <summary className="cursor-pointer list-none font-medium text-base sm:text-lg">
                      <span className="inline-block mr-2">{idx + 1}.</span>
                      <span>{faq.q}</span>
                    </summary>

                    <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      <p>{faq.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>

            <section className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Still have questions?</h2>
              <p className="text-sm text-muted-foreground mb-3">
                If your question is not listed here, please contact our sales team and we’ll get back to you shortly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="/contact" className="inline-block px-4 py-2 rounded-md bg-accent text-white text-sm text-center">
                  Contact Sales
                </a>
                <a href="tel:+919674084559" className="inline-block px-4 py-2 rounded-md border border-border text-sm text-center">
                  Call +91 96740 84559
                </a>
              </div>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Faq;