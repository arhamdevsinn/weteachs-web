// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import { db } from "@/src/lib/firebase/config";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const TransactionsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const storedId =
    typeof window !== "undefined"
      ? localStorage.getItem("user_id") ||
        localStorage.getItem("userId") ||
        null
      : null;
  const router = useRouter();
  const { user } = useAuth();
  const paramUserId = searchParams.get("userId") || searchParams.get("uid");
  const queryUserId = paramUserId || storedId || user?.uid || null;

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!queryUserId) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const limboRef = doc(db, "LimboUserMode", queryUserId);
        const transactionsCollection = collection(db, "transactions");

        const queries = [
          query(transactionsCollection, where("limboref", "==", limboRef)),
          query(transactionsCollection, where("limboref2", "==", limboRef)),
        ];

        const snapshots = await Promise.all(queries.map((q) => getDocs(q)));
        console.log("Fetched transaction snapshots:", snapshots);
        const allDocs = snapshots.flatMap((snap) => snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        const uniqueTransactions = allDocs.reduce((acc: any[], current) => {
          if (!acc.find((item) => item.id === current.id)) {
            acc.push(current);
          }
          return acc;
        }, []);

        const sortedTransactions = uniqueTransactions.sort((a, b) => {
          const getTime = (item: any) => {
            if (item.created_time?.toMillis) return item.created_time.toMillis();
            if (item.created_time?.toDate) return item.created_time.toDate().getTime();
            return new Date(item.created_time || 0).getTime();
          };
          return getTime(b) - getTime(a);
        });

        console.log("Fetched transactions:", sortedTransactions);
        setTransactions(sortedTransactions);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Unable to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [queryUserId]);
console.log("Current transactions state:", transactions);
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50"
            aria-label="Go back"
          >
            <ArrowRight className="h-5 w-5 rotate-180" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Transaction Details</h1>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading transactions...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No transactions found.</p>
            </div>
          ) : (
            transactions.map((transaction, index) => (
              <div key={transaction.id || index} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Topic</p>
                    <p className="text-lg font-semibold text-slate-900">{transaction.job_topic || "Unknown"}</p>
                  </div>
                  <div
                    className={
                      `rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ${
                        transaction.paid ? "bg-emerald-600" : "bg-rose-600"
                      }`
                    }
                  >
                    {transaction.paid ? "Paid" : "Unpaid"}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Amount</p>
                    <p className="text-lg font-semibold text-slate-900">${transaction.amount ?? 0}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
                  <div>
                    <p className="font-medium">Taxes</p>
                    <p>${transaction.amount_taxes ?? transaction["amount taxes"] ?? 0}</p>
                  </div>
                  <div>
                    <p className="font-medium">Student</p>
                    <p>{transaction.job_student_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Paid</p>
                    <p className={transaction.paid ? "text-emerald-600" : "text-rose-600"}>
                      {transaction.paid ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Created</p>
                    <p>
                      {transaction.created_time?.toDate
                        ? transaction.created_time.toDate().toLocaleString()
                        : transaction.created_time || "Unknown"}
                    </p>
                  </div>
                </div>
                {/* <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm text-slate-500">Stripe transfer ID: {transaction.stripe_transfer_id || "N/A"}</p>
                  <Button
                    type="button"
                    onClick={() => window.open(transaction.stripe_sessionld || "#", "_blank")}
                    className="rounded-full bg-primary px-4 py-2 text-white hover:bg-primary/90"
                  >
                    View Session
                  </Button>
                </div> */}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;