

export const SUBCATEGORIES = {
  New: [] as const,
  Industrial: [
    'Boiler Suit',
    'Safety Jacket',
    'Safety Vest',
    'Safety Shirt',
    'Safety Pant',
  ] as const,
  Hospital: [
    'Scrub',
    'Nurse Uniform',
    'Lab Coat',
    'Doctor Uniform',
    'Housekeeping Uniform',
  ] as const,
  Hotel: [
    'Housekeeping Uniform',
    'Front Office Uniform',
    'Cheff Coat',
    'Waiter Uniform',
    'Hospitality uniforms',
  ] as const,
  Corporate: [
    'Corporate Shirt',
    'Corporate Pant',
    'Corporate Suit',
    'Corporate Blazer',
    'Corporate Skirt',
    'Corporate T-Shirt',
  ] as const,
} as const;

export type Category = keyof typeof SUBCATEGORIES;                // 'Industrial' | 'Hospital' | 'Hotel' | 'Corporate'
export type Subcategory<C extends Category = Category> =
  (typeof SUBCATEGORIES)[C][number];