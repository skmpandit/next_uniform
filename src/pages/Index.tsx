import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroBanners from '@/components/HeroBanners';
import ProductGrid from '@/components/ProductGrid';
import SEO from '@/components/SEO';

const Index: React.FC = () => {
 const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Next Uniform",
  "url": "https://www.nextuniform.com",
  "logo": "https://www.nextuniform.com/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/nextuniform",
    "https://www.instagram.com/next_uniform"
  ],
  "contactPoint": [{
    "@type": "ContactPoint",
    "telephone": "+91-9674084559",
    "contactType": "sales",
    "areaServed": "IN",
    "email": "sales@nextuniform.com"
  }],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN"
  }
};

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Next Uniform — Industrial, Hospital & Hospitality Uniform Manufacturer (PAN India)",
    "description": "Next Uniform supplies industrial, hospital, corporate and hospitality uniforms across India. Bulk orders, custom branding, fast PAN India delivery. Request a quote.",
    "url": "https://www.nextuniform.com/",
    "inLanguage": "en-IN",
    "isPartOf": { "@type": "WebSite", "url": "https://www.nextuniform.com" }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* SEO: title/meta/OG + JSON-LD for Organization + WebPage */}
      <SEO
        title="Next Uniform — Industrial, Hospital & Hospitality Uniform Manufacturer (PAN India)"
        description="Next Uniform supplies industrial, hospital, corporate and hospitality uniforms across India. Bulk orders, custom branding, fast PAN India delivery. Request a quote."
        canonical="https://www.nextuniform.com/"
        image="https://www.nextuniform.com/og-image.jpg"
        jsonLd={[orgSchema, webpageSchema]}
      />

      <main>
        {/* Primary H1 for homepage (one H1 per page) */}
        <header className="sr-only">
          <h1>
            Next Uniform — Industrial, Hospital & Hospitality Uniform Manufacturer (PAN India)
          </h1>
          <p>
            Bulk uniforms for industries, hotels, hospitals and corporate offices — custom branding, fast PAN India delivery. Request a quote for bulk orders.
          </p>
        </header>

        <HeroBanners />

        {/* Product grid section is labelled and referenced for accessibility */}
        <ProductGrid />
      </main>

      <Footer />
    </div>
  );
};

export default Index;