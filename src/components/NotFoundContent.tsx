'use client';

import { useSearchParams } from "next/navigation";

export default function NotFoundContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  return <h1>Page not found. Reason: {reason}</h1>;
}
