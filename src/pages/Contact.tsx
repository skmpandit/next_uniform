import React, { useState } from 'react';
import Header from "@/components/Header";
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Honeypot field (anti-spam) — keep hidden from real users
  const [hp, setHp] = useState('');

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Contact — Next Uniform",
    "description": "Contact Next Uniform for bulk uniforms, corporate, industrial, hospital and hospitality uniform enquiries across India.",
    "url": "https://www.nextuniform.com/contact",
    "inLanguage": "en-IN",
    "isPartOf": { "@type": "WebSite", "url": "https://www.nextuniform.com" },
    "potentialAction": {
      "@type": "ContactAction",
      "target": "https://www.nextuniform.com/contact",
      "name": "Contact Next Uniform"
    }
  };

  const resetForm = () => {
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setMessage('');
    setHp('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setStatus('idle');

    // simple client-side validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill name, email and message.');
      setStatus('error');
      return;
    }
    if (hp.trim()) {
      // honeypot filled => likely a bot. silently ignore or return.
      setStatus('error');
      setErrorMsg('Spam detected.');
      return;
    }

    setSubmitting(true);
    try {
      // TODO: replace endpoint with your real API (serverless function, backend)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, company, email, phone, message, source: 'website-contact'
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Request failed: ${res.status}`);
      }

      setStatus('success');
      resetForm();
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <SEO
        title="Contact Next Uniform — Bulk & Custom Uniforms (PAN India)"
        description="Reach Next Uniform for industrial, hospital, hotel and corporate uniforms across India. Request a quote, bulk orders and custom branding support."
        canonical="https://www.nextuniform.com/contact"
        image="https://www.nextuniform.com/og-image.jpg"
        jsonLd={[webpageSchema]}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form card: spans 2 cols on lg, full width on smaller screens */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl shadow-md p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Contact Us</h1>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              For bulk uniform enquiries, custom branding, and PAN India delivery — tell us about your requirements and we'll respond within one business day.
            </p>

            {/* Status messages */}
            {status === 'success' && (
              <div className="mb-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3">
                Thank you — your request has been received. Our sales team will contact you soon.
              </div>
            )}
            {status === 'error' && errorMsg && (
              <div className="mb-4 rounded-md bg-rose-50 border border-rose-200 text-rose-900 px-4 py-3">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* honeypot: visually hidden */}
              <div className="sr-only" aria-hidden>
                <label>Leave this field empty</label>
                <input value={hp} onChange={(e) => setHp(e.target.value)} name="company_website" autoComplete="off" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium">Full name</span>
                  <input
                    className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Company (optional)</span>
                  <input
                    className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Acme Pvt Ltd"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium">Email</span>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Phone (optional)</span>
                  <input
                    type="tel"
                    className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="+91 98XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium">Message</span>
                <textarea
                  rows={6}
                  className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Tell us product names, quantity (MOQ), delivery city, timeline, branding needs..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center"
                  disabled={submitting}
                >
                  {submitting ? 'Sending…' : 'Send Message'}
                </Button>

                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200"
                  onClick={() => {
                    setCompany('Sample Company');
                    setMessage('Requesting a quote for 200 pcs — delivery to Mumbai within 30 days. Please advise lead time and pricing.');
                  }}
                >
                  Quick sample
                </button>

                <span className="text-xs sm:text-sm text-muted-foreground ml-auto">Fields marked required*</span>
              </div>
            </form>
          </div>

          {/* Right: Contact info / map - sticky on lg */}
          <aside className="bg-white dark:bg-neutral-900 rounded-2xl shadow-md p-5 sm:p-6 lg:p-6 flex flex-col gap-6 lg:sticky lg:top-28">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3">Contact details</h2>

              <div className="space-y-4 text-sm sm:text-base">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">Sales</div>
                    <a href="tel:+919674084559" className="block font-medium">+91 96740 84559</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <a href="mailto:sales@nextuniform.com" className="block font-medium">sales@nextuniform.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">Service area</div>
                    <div className="font-medium">PAN India</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">Office hours</div>
                    <div className="font-medium">Mon–Sat — 09:30 to 18:30 IST</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border text-sm text-muted-foreground">
              <p className="mb-2"><strong>For quotations</strong> — include product names, estimated quantity (MOQ), delivery city, required delivery date and branding requirements.</p>
              <p>If you'd like a formal PI / pricing, mention your PO reference and preferred payment terms.</p>
            </div>

            {/* Map placeholder (responsive heights) */}
            <div>
              <div className="w-full rounded-md bg-gray-100 dark:bg-neutral-800 grid place-items-center text-sm text-muted-foreground"
                   style={{ height: '9rem' }} // fallback height for very small displays
              >
                <div className="w-full h-full rounded-md overflow-hidden">
                  {/* responsive height adjustments via utility classes */}
                  <div className="w-full h-full grid place-items-center text-sm text-muted-foreground"
                       style={{ minHeight: 144 }}
                  >
                    Map / office location (add iframe here if you have a postal address)
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;