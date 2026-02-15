import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const CookiePolicy: React.FC = () => {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Next Uniform",
    "url": "https://www.nextuniform.com",
    "logo": "https://www.nextuniform.com/logo.png",
    "contactPoint": [{
      "@type": "ContactPoint",
      "telephone": "+91-9674984559",
      "contactType": "sales",
      "areaServed": "IN",
      "email": "admin@nextuniform.com"
    }],
    "sameAs": [
      "https://www.linkedin.com/company/nextuniform",
      "https://www.instagram.com/next_uniform"
    ]
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Cookie Policy — Next Uniform",
    "description": "Cookie Policy for Next Uniform. Learn what cookies we use, why we use them, and how you can manage them for privacy and performance.",
    "url": "https://www.nextuniform.com/cookie-policy",
    "inLanguage": "en-IN",
    "isPartOf": { "@type": "WebSite", "url": "https://www.nextuniform.com" }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <SEO
        title="Cookie Policy — Next Uniform"
        description="Learn how Next Uniform uses cookies and similar technologies. Manage cookies, understand types (essential, performance, functionality, advertising) and third-party usage."
        canonical="https://www.nextuniform.com/cookie-policy"
        image="https://www.nextuniform.com/og-image.jpg"
        jsonLd={[orgSchema, webpageSchema]}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-4 lg:gap-10">
          {/* TOC - visible on large screens */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-28 h-fit self-start">
            <div className="rounded-xl border border-border bg-white dark:bg-neutral-900 p-4 shadow-sm">
              <h3 className="text-sm font-semibold mb-3">On this page</h3>
              <nav aria-label="Cookie Policy table of contents" className="text-sm space-y-2">
                <a className="block text-muted-foreground hover:text-foreground" href="#what-are-cookies">What are cookies?</a>
                <a className="block text-muted-foreground hover:text-foreground" href="#types">Types we use</a>
                <a className="block text-muted-foreground hover:text-foreground" href="#third-party">Third-party cookies</a>
                <a className="block text-muted-foreground hover:text-foreground" href="#manage">Managing cookies</a>
                <a className="block text-muted-foreground hover:text-foreground" href="#contact">Contact</a>
              </nav>
            </div>
          </aside>

          <article className="lg:col-span-3 space-y-8">
            <header className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Cookie Policy</h1>
              <p className="text-sm text-muted-foreground">
                This Cookie Policy explains how Next Uniform ("we", "our", or "us") uses cookies and similar tracking technologies on our website. By using our website, you consent to the use of cookies as described in this policy.
              </p>
            </header>

            <section id="what-are-cookies" className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">What are cookies?</h2>
              <p className="text-sm text-muted-foreground mb-2">
                Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website.
                They help websites remember information about your visit and make the site work more efficiently.
              </p>
              <p className="text-sm text-muted-foreground">
                Cookies can be persistent (stay on your device after the browser is closed) or session-based (deleted when the browser is closed).
              </p>
            </section>

            <section id="types" className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Types of cookies we use</h2>

              <div className="space-y-3">
                <details className="group rounded-md p-4 border border-border" aria-expanded="false">
                  <summary className="cursor-pointer font-medium text-sm flex justify-between items-center">
                    <span>Essential Cookies</span>
                    <span className="text-xs text-muted-foreground group-open:font-semibold">Required for site function</span>
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>
                      These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas of the site.
                      Without these cookies, the website cannot operate correctly.
                    </p>
                  </div>
                </details>

                <details className="group rounded-md p-4 border border-border">
                  <summary className="cursor-pointer font-medium text-sm flex justify-between items-center">
                    <span>Performance Cookies</span>
                    <span className="text-xs text-muted-foreground group-open:font-semibold">Analytics & performance</span>
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>
                      These cookies collect information about how visitors use our website (e.g. which pages are visited most).
                      We use this information to improve performance and user experience. Data collected is generally aggregated and anonymous.
                    </p>
                  </div>
                </details>

                <details className="group rounded-md p-4 border border-border">
                  <summary className="cursor-pointer font-medium text-sm flex justify-between items-center">
                    <span>Functionality Cookies</span>
                    <span className="text-xs text-muted-foreground group-open:font-semibold">Remember choices</span>
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>
                      These cookies allow our website to remember choices you make (such as language or region) to provide a more personalized experience.
                    </p>
                  </div>
                </details>

                <details className="group rounded-md p-4 border border-border">
                  <summary className="cursor-pointer font-medium text-sm flex justify-between items-center">
                    <span>Advertising Cookies</span>
                    <span className="text-xs text-muted-foreground group-open:font-semibold">Ads & targeting</span>
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>
                      Advertising cookies help deliver relevant advertisements to you and measure the effectiveness of ad campaigns.
                      These cookies may be placed by third-party advertising networks and can track your activity across sites.
                    </p>
                  </div>
                </details>
              </div>
            </section>

            <section id="third-party" className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Third-Party Cookies</h2>
              <p className="text-sm text-muted-foreground mb-2">
                We may use third-party services that set cookies on your device (for example analytics and advertising vendors). These third parties have their own cookie policies and privacy practices which we do not control.
              </p>
              <p className="text-sm text-muted-foreground">
                We recommend reviewing the privacy policies of those third parties to learn how they handle and protect your data.
              </p>
            </section>

            <section id="manage" className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Managing Cookies</h2>
              <p className="text-sm text-muted-foreground mb-2">
                You can manage or disable cookies through your browser settings. Most browsers allow you to refuse cookies or delete existing cookies.
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Note: if you disable cookies, some features of our website may not function properly (for example saved preferences or the shopping cart).
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  className="block rounded-md border border-border p-3 text-sm hover:bg-gray-50 dark:hover:bg-neutral-800"
                  href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer"
                >
                  How to manage cookies in Chrome
                </a>
                <a
                  className="block rounded-md border border-border p-3 text-sm hover:bg-gray-50 dark:hover:bg-neutral-800"
                  href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noreferrer"
                >
                  How to manage cookies in Firefox
                </a>
              </div>
            </section>

            <section id="contact" className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Contact</h2>
              <p className="text-sm text-muted-foreground mb-2">
                If you have questions about this Cookie Policy or want to request removal of tracking, contact us:
              </p>
              <ul className="list-none space-y-1 text-sm">
                <li><strong>Email:</strong> <a href="mailto:admin@nextuniform.com" className="text-emerald-600 hover:underline">admin@nextuniform.com</a></li>
                <li><strong>Phone:</strong> <a href="tel:+919674984559" className="text-emerald-600 hover:underline">+91 96749 84559</a></li>
              </ul>

              <p className="text-xs text-muted-foreground mt-4">
                This Cookie Policy is part of our broader Privacy Policy. For more details on data handling and your rights, see our <a href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</a>.
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;