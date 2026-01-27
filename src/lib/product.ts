import type { Category, Subcategory } from './catalog';


export interface BaseProduct {
  id: string;
  name: string;
  price: number;
  images: string[];              // 3–4 images
  sizes?: string[];
  description: string[];         // paragraphs
  details: string[];             // bullets
  careInstructions: string[];    // bullets/steps
  isNew?: boolean;
  rating?: number;
  reviews?: number;
  category?: string;
  subcategory?: string;
  moq?: number;                  // default 50 if you want
}

export interface Product<C extends Category = Category> extends BaseProduct {
  category: C;
  subcategory: Subcategory<C>;   // ✅ TS enforces valid pair
}