// src/pages/PrivacyPolicy.tsx
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const PrivacyPolicy: React.FC = () => {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Next Uniform",
    "url": "https://www.nextuniform.com",
    "logo": "https://www.nextuniform.com/logo.png",
    "contactPoint": [{
      "@type": "ContactPoint",
      "telephone": "+91-9674084559",
      "contactType": "sales",
      "areaServed": "IN",
      "email": "sales@nextuniform.com"
    }],
    "sameAs": [
      "https://www.linkedin.com/company/nextuniform",
      "https://www.instagram.com/next_uniform"
    ]
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy — Next Uniform",
    "description": "Next Uniform Privacy Policy — how we collect, use, and protect your personal information for orders, accounts, and communication across India.",
    "url": "https://www.nextuniform.com/privacy",
    "inLanguage": "en-IN",
    "isPartOf": { "@type": "WebSite", "url": "https://www.nextuniform.com" }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <SEO
        title="Privacy Policy — Next Uniform"
        description="Learn how Next Uniform collects, uses, and safeguards your personal information for orders, accounts and marketing. Your privacy matters."
        canonical="https://www.nextuniform.com/privacy"
        image="https://www.nextuniform.com/og-image.jpg"
        jsonLd={[orgSchema, webpageSchema]}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-4 lg:gap-10">
          {/* Table of contents on large screens */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-28 h-fit self-start">
            <div className="rounded-xl border border-border bg-white dark:bg-neutral-900 p-4 shadow-sm">
              <h3 className="text-sm font-semibold mb-3">Contents</h3>
              <nav className="text-sm space-y-2" aria-label="Privacy policy table of contents">
                <a className="block text-muted-foreground hover:text-foreground" href="#intro">Overview</a>
                <a className="block text-muted-foreground hover:text-foreground" href="#info-we-collect">Information we collect</a>
                <a className="block text-muted-foreground hover:text-foreground" href="#how-we-use">How we use information</a>
                <a className="block text-muted-foreground hover:text-foreground" href="#data-security">Data security</a>
                <a className="block text-muted-foreground hover:text-foreground" href="#your-rights">Your rights</a>
                <a className="block text-muted-foreground hover:text-foreground" href="#changes">Changes</a>
                <a className="block text-muted-foreground hover:text-foreground" href="#contact">Contact</a>
              </nav>
            </div>
          </aside>

          <article className="lg:col-span-3 space-y-6">
            <header className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Privacy Policy</h1>
              <p className="text-sm text-muted-foreground">
                At Next Uniform, we are committed to protecting your privacy and ensuring the security of your personal information.
                This Privacy Policy explains what data we collect, why we collect it, and how we keep it safe.
              </p>
            </header>

            <section id="intro" className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Overview</h2>
              <p className="text-sm text-muted-foreground">
                This policy covers personal information collected when you visit our website, create an account, place orders, or contact our support/sales teams.
                We process data to provide products and services, communicate with customers, and comply with legal obligations.
              </p>
            </section>

            <section id="info-we-collect" className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Information we collect</h2>

              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  We may collect personal information such as:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Account & order data:</strong> name, email, shipping address, billing address, phone number, order history.</li>
                  <li><strong>Payment info:</strong> payment method details (processed securely via our payment provider; we do not store raw card numbers).</li>
                  <li><strong>Support communications:</strong> messages you send to our support or sales teams (email, contact form).</li>
                  <li><strong>Technical & analytics data:</strong> IP address, browser type, device information, pages visited (collected via cookies and analytics).</li>
                </ul>
                <p>
                  We use cookies and similar technologies — see our <a href="/cookie-policy" className="text-emerald-600 hover:underline">Cookie Policy</a> for details.
                </p>
              </div>
            </section>

            <section id="how-we-use" className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">How we use your information</h2>
              <p className="text-sm text-muted-foreground mb-2">
                We process personal data for the following purposes:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="rounded-md border border-border p-4">
                  <h3 className="font-medium mb-2">Order fulfilment</h3>
                  <p className="text-muted-foreground">Process orders, shipping and returns, invoicing and payment reconciliation.</p>
                </div>
                <div className="rounded-md border border-border p-4">
                  <h3 className="font-medium mb-2">Customer support</h3>
                  <p className="text-muted-foreground">Respond to inquiries, manage accounts, and provide after-sales support.</p>
                </div>
                <div className="rounded-md border border-border p-4">
                  <h3 className="font-medium mb-2">Marketing</h3>
                  <p className="text-muted-foreground">With consent, send promotional emails and offers. You can opt-out at any time.</p>
                </div>
                <div className="rounded-md border border-border p-4">
                  <h3 className="font-medium mb-2">Analytics & improvements</h3>
                  <p className="text-muted-foreground">Analyze site usage to improve products and user experience.</p>
                </div>
              </div>
            </section>

            <section id="data-security" className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Data security</h2>
              <p className="text-sm text-muted-foreground mb-2">
                We implement industry-standard safeguards (encryption in transit, secure hosting, access controls) to protect your data.
                While we strive to protect data, no transmission over the internet is 100% secure — please use strong passwords and keep account details private.
              </p>

              <details className="mt-3 p-3 border border-border rounded-md">
                <summary className="cursor-pointer font-medium">Security practices (summary)</summary>
                <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>HTTPS for all traffic</li>
                  <li>Encrypted backups and restricted access to production systems</li>
                  <li>Third-party processors (payments, email) are vetted and contractually required to protect data</li>
                </ul>
              </details>
            </section>

            <section id="your-rights" className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Your rights</h2>
              <p className="text-sm text-muted-foreground mb-2">
                You have the right to access, correct, or request deletion of your personal information. For marketing messages you may unsubscribe anytime using the link in emails.
              </p>
              <p className="text-sm text-muted-foreground">
                To exercise your rights or request data export/deletion, contact: <a className="text-emerald-600 hover:underline" href="mailto:sales@nextuniform.com">sales@nextuniform.com</a>.
              </p>
            </section>

            <section id="changes" className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Changes to this policy</h2>
              <p className="text-sm text-muted-foreground">
                We may update this Privacy Policy to reflect legal or operational changes. We will post the updated policy with a revised effective date on this page.
                Please check back periodically.
              </p>
            </section>

            <section id="contact" className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Contact</h2>
              <p className="text-sm text-muted-foreground mb-2">
                If you have questions about this policy or wish to exercise your data rights, contact us:
              </p>
              <ul className="text-sm space-y-1">
                <li><strong>Email:</strong> <a href="mailto:sales@nextuniform.com" className="text-emerald-600 hover:underline">sales@nextuniform.com</a></li>
                <li><strong>Phone:</strong> <a href="tel:+919674084559" className="text-emerald-600 hover:underline">+91 96740 84559</a></li>
              </ul>
              <p className="text-xs text-muted-foreground mt-4">
                This policy is part of our broader privacy & cookie practices. See our <a href="/cookie-policy" className="text-emerald-600 hover:underline">Cookie Policy</a> and <a href="/terms-and-conditions" className="text-emerald-600 hover:underline">Terms & Conditions</a>.
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;