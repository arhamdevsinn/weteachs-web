// @ts-nocheck
"use client";

import CategoriesCard from "@/src/components/categories/CategoriesCard";
import React from "react";
import { useParams } from "next/navigation";

const CategoryPage = () => {
  const params = useParams();
  const categoryName = params.categoryName;

  return (
    <div className="min-h-screen bg-secondary">
      <CategoriesCard filterCategory={categoryName} />
    </div>
  );
};

export default CategoryPage;
