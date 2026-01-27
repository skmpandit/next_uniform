import { readFile, writeFile } from 'fs/promises';
import path from 'path';

(async () => {
  try {
    const srcPath = path.resolve(process.cwd(), 'src', 'data', 'product.ts');
    const outPath = path.resolve(process.cwd(), 'scripts', 'products.json');

    const raw = await readFile(srcPath, 'utf8');

    // 1) capture id: 'some-id' or "id": "some-id"
    const idRegex = /(?:['"]id['"]\s*:\s*|id\s*:\s*)['"]([^'"]+)['"]/g;

    // 2) also capture top-level object keys like 'industrial-safety-jacket-neon': { ... }
    const keyRegex = /['"]([a-z0-9\-]+)['"]\s*:\s*{/gi;

    const ids = new Set();

    let m;
    while ((m = idRegex.exec(raw)) !== null) {
      if (m[1]) ids.add(m[1].trim());
    }

    while ((m = keyRegex.exec(raw)) !== null) {
      if (m[1]) ids.add(m[1].trim());
    }

    const list = Array.from(ids).sort().map((id) => ({ id, slug: id }));

    await writeFile(outPath, JSON.stringify(list, null, 2), 'utf8');

    console.log(`✅ scripts/products.json written (${list.length} items)`);
  } catch (err) {
    console.error('❌ Failed to export products from TypeScript file:', err);
    process.exit(1);
  }
})();