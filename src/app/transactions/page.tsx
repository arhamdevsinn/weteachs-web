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
  const [expandedTransactionId, setExpandedTransactionId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));

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
        setCurrentPage(1);
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
            <>
              {transactions
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((transaction, index) => {
                  const id = transaction.id || String(index);
                  const isExpanded = expandedTransactionId === id;

                  return (
                    <div
                      key={id}
                      className="rounded-lg border border-gray-200 bg-white"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedTransactionId(isExpanded ? null : id)}
                        className="w-full p-4 text-left"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-sm text-slate-500">Topic</p>
                            <p className="text-lg font-semibold text-slate-900">{transaction.job_topic || "Unknown"}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ${
                                transaction.paid ? "bg-emerald-600" : "bg-rose-600"
                              }`}
                            >
                              {transaction.paid ? "Paid" : "Unpaid"}
                            </span>
                            <div className="text-right">
                              <p className="text-sm text-slate-500">Amount</p>
                              <p className="text-lg font-semibold text-slate-900">${transaction.amount ?? 0}</p>
                            </div>
                          </div>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-gray-200 bg-slate-50 p-4 text-sm text-slate-700">
                          <div className="grid gap-3 md:grid-cols-2">
                            <div>
                              <p className="font-medium text-slate-900">Taxes</p>
                              <p>${transaction.amount_taxes ?? transaction["amount taxes"] ?? 0}</p>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">Student</p>
                              <p>{transaction.job_student_name || "N/A"}</p>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">Created</p>
                              <p>
                                {transaction.created_time?.toDate
                                  ? transaction.created_time.toDate().toLocaleString()
                                  : transaction.created_time || "Unknown"}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">Stripe transfer ID</p>
                              <p>{transaction.stripe_transfer_id || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

              {totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-slate-600">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;