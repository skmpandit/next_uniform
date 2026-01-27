const { writeFileSync } = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');

async function run() {
  const sitemap = new SitemapStream({ hostname: 'https://www.nextuniform.com' });
  const urls = [
    '/', '/industrial-uniforms', '/boiler-suit', '/safety-jacket',
    '/safety-vest', '/hospital-uniforms', '/scrub-uniform', '/hospitality-uniforms',
    '/corporate-uniforms', '/contact', '/faq'
  ];

  urls.forEach(url => sitemap.write({ url, changefreq: 'weekly', priority: 0.8 }));
  sitemap.end();

  const buffer = await streamToPromise(sitemap);
  writeFileSync('dist/sitemap.xml', buffer.toString());
  console.log('sitemap.xml created in dist/');
}

run().catch(console.error);