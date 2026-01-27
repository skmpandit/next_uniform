import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { productData } from '@/data/product';

const ProductGrid = () => {
  // Get all products as array
  const allProducts = Object.values(productData);

  // Group products by category and take only 1 from each (the first or newest)
  const categoryMap: Record<string, typeof allProducts[0]> = {};
  for (const product of allProducts) {
    const category = product.category?.trim();
    if (!category) continue;
    // Only keep the first product per category (or replace if marked isNew)
    if (!categoryMap[category] || product.isNew) {
      categoryMap[category] = product;
    }
  }

  // Convert map back to array and sort by category name (optional)
  const representativeProducts = Object.values(categoryMap).sort((a, b) =>
    a.category?.localeCompare(b.category || '') ?? 0
  );

  return (
    <section id="explore-by-category" aria-labelledby="explore-by-category-heading" className="py-12 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h2 id="explore-by-category-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Explore by Category
          </h2>
          <p className="text-muted-foreground">
            One top product from each of our premium categories
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" role="list">
          {representativeProducts.map((product) => (
            <div role="listitem" key={product.id}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-8">
          <Link
            to="/products"
            className="inline-block px-5 py-3 rounded-md bg-boutique-orange text-white font-semibold hover:opacity-95 transition"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;