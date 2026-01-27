const { writeFileSync } = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');

(async function run() {
  try {
    const sitemap = new SitemapStream({ hostname: 'https://www.nextuniform.com' });

    const urls = [
      '/', '/products?category=Industrial', '/boiler-suit', '/safety-jacket',
      '/safety-vest', '/hospital-uniforms', '/products?category=Hotel', '/products?category=Hospital',
      '/products?category=Corporate', '/contact', '/faq', '/terms-and-conditions', '/privacy', '/cookie-policy', '/products', '/returns', '/sizeguide',
      '/products?category=Industrial&subcategory=Boiler+Suit',  '/products?category=Industrial&subcategory=Safety+Jacket', '/products?category=Industrial&subcategory=Safety+Vest', '/products?category=Industrial&subcategory=Safety+Shirt', '/products?category=Industrial&subcategory=Safety+Pant',
      '/products?category=Hospital&subcategory=Scrub', '/products?category=Hospital&subcategory=Nurse+Uniform', '/products?category=Hospital&subcategory=Lab+Coat', '/products?category=Hospital&subcategory=Doctor+Uniform', '/products?category=Hospital&subcategory=Housekeeping+Uniform',
      '/products?category=Hotel&subcategory=Housekeeping+Uniform', '/products?category=Hotel&subcategory=Front+Office+Uniform', '/products?category=Hotel&subcategory=Cheff+Coat', '/products?category=Hotel&subcategory=Waiter+Uniform', '/products?category=Hotel&subcategory=Hospitality+uniforms',
      '/products?category=Corporate&subcategory=Corporate+Shirt', '/products?category=Corporate&subcategory=Corporate+Pant', '/products?category=Corporate&subcategory=Corporate+Suit', '/products?category=Corporate&subcategory=Corporate+Blazer', '/products?category=Corporate&subcategory=Corporate+Skirt'
    ];

    for (const url of urls) {
      sitemap.write({ url, changefreq: 'weekly', priority: 0.8 });
    }

    sitemap.end();

    const buffer = await streamToPromise(sitemap);
    writeFileSync('dist/sitemap.xml', buffer.toString());
    console.log('✅ sitemap.xml created in dist/');
  } catch (err) {
    console.error('Failed to generate sitemap:', err);
    process.exitCode = 1;
  }
})();