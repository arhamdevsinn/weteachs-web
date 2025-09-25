// @ts-nocheck
"use client";

import CategoriesCard from "@/src/components/categories/CategoriesCard";
import React from "react";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const teacherId = searchParams.get("teacherId");

  return (
    <>
      <CategoriesCard teacherId={teacherId} />
    </>
  );
};

export default Page;
