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

export default function CategoryMenu({
  categories,
}: CategoryMenuProps) {
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("keyword");

  const categoriesList = Array.isArray(categories)
    ? categories
    : [];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3 justify-center items-center">

        <Link
          href="/"
          className={`px-6 py-2 rounded-lg font-semibold ${
            !activeCategory
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Tất cả
        </Link>

        {categoriesList.map((category, index) => {
          const isActive =
            activeCategory === category.tenDanhMuc;

          return (
            <Link
              key={category.maDanhMuc || index}
              href={`/seachList?keyword=${encodeURIComponent(
  category.tenDanhMuc
)}`}
              className={`px-6 py-2 rounded-lg font-semibold ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700"
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