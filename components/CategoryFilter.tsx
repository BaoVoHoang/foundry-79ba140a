'use client';

import { useMemo } from 'react';
import type { Product } from '@/lib/types';

interface CategoryFilterProps {
  products: Product[];
  selectedCategory: string;
  onFilterChange: (category: string) => void;
}

export default function CategoryFilter({
  products,
  selectedCategory,
  onFilterChange,
}: CategoryFilterProps) {
  const categories = useMemo(() => {
    const unique = new Set(products.map((product) => product.category));
    return Array.from(unique).sort();
  }, [products]);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
        Category:
      </label>
      <select
        id="category-filter"
        value={selectedCategory}
        onChange={(e) => onFilterChange(e.target.value)}
        className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="All">All</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
