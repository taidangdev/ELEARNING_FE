"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Category {
  maDanhMuc: string;
  tenDanhMuc: string;
}

interface CategoryMenuProps {
  categories: Category[];
}

export default function CategoryMenu({ categories }: CategoryMenuProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  // Đảm bảo categories là array
  const categoriesList = Array.isArray(categories) ? categories : [];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3 justify-center items-center">
        {/* Nút "Tất cả" */}
        <Link
          href="/"
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
            !activeCategory
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
          }`}
        >
          Tất cả
        </Link>

        {/* Các nút danh mục */}
        {categoriesList.map((category, index) => {
          const isActive = activeCategory === category.maDanhMuc;
          const uniqueKey = category.maDanhMuc || `category-${index}-${category.tenDanhMuc}`;
          
          return (
            <Link
              key={uniqueKey}
              href={`/?category=${category.maDanhMuc}`}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
              }`}
            >
              {category.tenDanhMuc}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

