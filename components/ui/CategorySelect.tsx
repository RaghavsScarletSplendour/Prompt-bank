"use client";

import { Category } from "@/lib/types";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: Category[];
  className?: string;
}

export default function CategorySelect({ value, onChange, categories, className = "" }: CategorySelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      <option value="">No Category</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}
