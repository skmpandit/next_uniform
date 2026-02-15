import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'
import SEO from '@/components/SEO'; // <-- added

const TormsConditions: React.FC = () => {
  // JSON-LD for WebPage + Organization (SEO only — no UI changes)
  const canonical = 'https://www.nextuniform.com/terms-and-conditions';
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms & Conditions — Next Uniform",
    description:
      "Terms and Conditions for using Next Uniform (www.nextuniform.com). Please read these terms carefully before using our website or placing orders.",
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
    sameAs: [
      "https://www.linkedin.com/company/nextuniform",
      "https://www.instagram.com/next_uniform"
    ],
    contactPoint: [{
      "@type": "ContactPoint",
      telephone: "+91-9674984559",
      contactType: "sales",
      areaServed: "IN",
      email: "admin@nextuniform.com"
    }],
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN"
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      <Header/>

      {/* SEO (only addition) */}
      <SEO
        title="Terms & Conditions — Next Uniform"
        description="Welcome to Next Uniform. Read our Terms & Conditions for using www.nextuniform.com including cookies, purchases, returns and user responsibilities."
        canonical={canonical}
        image="https://www.nextuniform.com/og-image.jpg"
        jsonLd={[orgSchema, webpageSchema]}
      />

        <div className='container mx-auto px-4 py-8'>
          <div className='text-center space-y-4'>
            <h1 className="text-2xl font-semibold mb-6">Terms & Conditions</h1>
          </div>
          <p className="mb-6 text-sm opacity-80">
            Welcome to Next Uniform! These Terms and Conditions outline the rules and regulations for the use of Next Uniform's Website, located at www.nextuniform.com.
          </p>
          <p className="mb-6 text-sm opacity-80">
            By accessing this website we assume you accept these terms and conditions. Do not continue to use Next Uniform if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          <p className="mb-6 text-sm opacity-80">
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.
          </p>
          <h2 className="text-xl font-semibold mb-4">Cookies</h2>
          <p className="mb-6 text-sm opacity-80">
            We employ the use of cookies. By accessing Next Uniform, you agreed to use cookies in agreement with the Next Uniform's Privacy Policy.
          </p>
          <p className="mb-6 text-sm opacity-80">
            Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/
          </p>  
        </div>
      <Footer/>
    </div>
  )
}

export default TormsConditions