"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase/config";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";

type NotificationItem = {
  id: string;
  avatar: string;
  title: string;
  status?: string;
  details?: string;
  timeLabel: string;
  createdTimeMs: number;
  type?: string;
  read?: boolean;
};

const formatNotificationTime = (value: unknown) => {
  if (!value) return "Just now";

  if (typeof value === "object" && value && "toDate" in value) {
    const date = (value as { toDate: () => Date }).toDate();
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (value instanceof Date) {
    return value.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    }
  }

  return "Just now";
};

const buildNotificationTitle = (data: Record<string, unknown>) => {
  const studentName = (data.student_name as string) || "";
  const message = (data.message as string) || "";
  const topic = (data.topic as string) || "";

  if (studentName && message) return `${studentName} ${message}`;
  if (studentName && topic) return `${studentName} ${topic}`;
  if (message) return message;
  if (topic) return topic;
  return "Notification";
};

const Page = () => {
  const { userId, profile } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const receiverRef = doc(db, "LimboUserMode", userId);
        const receiverPath = `/LimboUserMode/${userId}`;
        const receiverPathNoSlash = `LimboUserMode/${userId}`;
        const notificationsRef = collection(db, "Notifications");
        const qByRef = query(
          notificationsRef,
          where("receiver_ref", "==", receiverRef),
          orderBy("created_time", "desc")
        );
        const qByPath = query(
          notificationsRef,
          where("receiver_ref", "==", receiverPath),
          orderBy("created_time", "desc")
        );
        const qByPathNoSlash = query(
          notificationsRef,
          where("receiver_ref", "==", receiverPathNoSlash),
          orderBy("created_time", "desc")
        );

        const [snapshotByRef, snapshotByPath, snapshotByPathNoSlash] = await Promise.all([
          getDocs(qByRef),
          getDocs(qByPath),
          getDocs(qByPathNoSlash),
        ]);
console.log("Fetched notifications snapshots:", {
  byRef: snapshotByRef.docs.map((doc) => ({ id: doc.id, data: doc.data() })),
  byPath: snapshotByPath.docs.map((doc) => ({ id: doc.id, data: doc.data() })),
  byPathNoSlash: snapshotByPathNoSlash.docs.map((doc) => ({ id: doc.id, data: doc.data() })),
});
        const byId = new Map<string, NotificationItem>();
        const toItem = (docSnap: typeof snapshotByRef.docs[number]) => {
          const data = docSnap.data();
          const title = buildNotificationTitle(data);
          const createdTimeMs =
            data.created_time?.toDate?.()?.getTime?.() ||
            (data.created_time instanceof Date
              ? data.created_time.getTime()
              : typeof data.created_time === "string"
                ? new Date(data.created_time).getTime()
                : 0);
          const timeLabel = formatNotificationTime(data.created_time);
          const status = data.did_didnt_accept as string | undefined;
          const detailsParts = [data.hired_time_amount, data.hired_price].filter(Boolean);

          return {
            id: docSnap.id,
            avatar:
              (data.student_profile_pic as string) ||
              (data.teacher_profile_pic as string) ||
              "/logo.png",
            title,
            status,
            details: detailsParts.length ? detailsParts.join(" ") : undefined,
            timeLabel,
            createdTimeMs,
            type: data.type as string | undefined,
            read: Boolean(data.read_status),
          } as NotificationItem;
        };

        snapshotByRef.docs.forEach((docSnap) => {
          byId.set(docSnap.id, toItem(docSnap));
        });
        snapshotByPath.docs.forEach((docSnap) => {
          byId.set(docSnap.id, toItem(docSnap));
        });
        snapshotByPathNoSlash.docs.forEach((docSnap) => {
          byId.set(docSnap.id, toItem(docSnap));
        });

        const rows = Array.from(byId.values()).sort((a, b) => {
          const aTime = Number.isFinite(a.createdTimeMs) ? a.createdTimeMs : 0;
          const bTime = Number.isFinite(b.createdTimeMs) ? b.createdTimeMs : 0;
          return bTime - aTime;
        });

        setNotifications(rows);
        console.log("Fetched notifications:", rows);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);
  console.log("Notifications loaded:", notifications);
  const isTeacher = Boolean(profile?.isTeacher);

  const canOpenJobPreview = (item: NotificationItem) => {
    const type = (item.type || "").toLowerCase();
    const status = (item.status || "").toLowerCase();

    if (!type.includes("hired")) return false;
    if (isTeacher) return status === "no";
    return status === "accepted";
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (!canOpenJobPreview(item)) return;
    router.push(`/job-preview?notificationId=${item.id}`);
  };

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  return (
    <div className="min-h-screen bg-[#ececec]">
      <header className="sticky top-0 z-10 bg-[#1f6f3f] px-5 pb-5 pt-8 shadow-sm">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-wide text-white/90 sm:text-3xl">
            Notifications
          </h1>

          <button
            type="button"
            aria-label="Notification alerts"
            className="relative rounded-full p-2 text-black/95"
          >
            <Bell className="h-8 w-8" />
            {unreadCount > 0 ? (
              <span className="absolute -right-2 -top-2 inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-[#f25a6d] px-2 text-base font-semibold text-white">
                {unreadCount}
              </span>
            ) : null}
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-col gap-2 px-4 py-4 pb-28">
        {loading ? (
          <div className="rounded-[10px] border-2 border-dashed border-[#2f7b4f] bg-[#f5f5f5] px-3 py-6 text-center text-lg text-black/70">
            Loading notifications...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-[10px] border-2 border-red-300 bg-[#fff5f5] px-3 py-6 text-center text-lg text-red-600">
            {error}
          </div>
        ) : null}

        {!loading && !error && notifications.length === 0 ? (
          <div className="rounded-[10px] border-2 border-[#2f7b4f] bg-[#f5f5f5] px-3 py-6 text-center text-lg text-black/70">
            No notifications yet.
          </div>
        ) : null}

        {!loading && !error
          ? notifications.map((item) => (
              <article
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                onKeyDown={(event) => {
                  if (!canOpenJobPreview(item)) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleNotificationClick(item);
                  }
                }}
                role={canOpenJobPreview(item) ? "button" : undefined}
                tabIndex={canOpenJobPreview(item) ? 0 : undefined}
                className={`rounded-[10px] border-2 border-[#2f7b4f] bg-[#f5f5f5] px-3 py-3 ${
                  canOpenJobPreview(item)
                    ? "cursor-pointer transition hover:border-[#1f6f3f] hover:bg-[#eef6f0]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-[50px] w-[50px] shrink-0 overflow-hidden rounded-full bg-[#dfdfdf]">
                    <Image
                      src={item.avatar}
                      alt={item.title}
                      width={50}
                      height={50}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="line-clamp-2 text-lg font-semibold leading-[1.1] text-black sm:text-xl">
                      {item.title}
                    </p>

                    {item.status ? (
                      <p className="mt-1 text-lg text-black/90 sm:text-md">
                        <span
                          className={
                            item.status === "Accepted"
                              ? "font-semibold text-[#24aa4b]"
                              : "font-semibold text-black"
                          }
                        >
                          {item.status}
                        </span>{" "}
                        {item.details ? `${item.details} • ` : ""}
                        {item.timeLabel}
                      </p>
                    ) : (
                      <p className="mt-1 text-lg text-black/85 sm:text-md">
                        {item.timeLabel}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))
          : null}
      </main>

      {/* <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-black/10 bg-[#ececec] px-2 py-2">
        <div className="mx-auto grid w-full max-w-2xl grid-cols-5 gap-1">
          <Link href="/" className="flex flex-col items-center justify-center py-1 text-black">
            <Home className="h-6 w-6" />
            <span className="text-sm">Home</span>
          </Link>
          <Link href="/categories" className="flex flex-col items-center justify-center py-1 text-black">
            <Search className="h-6 w-6" />
            <span className="text-sm">Search</span>
          </Link>
          <Link href="/upload" className="flex flex-col items-center justify-center py-1 text-black">
            <PlusCircle className="h-7 w-7" />
            <span className="text-sm">Create</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center justify-center py-1 text-black">
            <MessageCircle className="h-6 w-6" />
            <span className="text-sm">Message</span>
          </Link>
          <Link
            href="/notifications"
            className="flex flex-col items-center justify-center py-1 text-[#a28c4f]"
          >
            <Bell className="h-6 w-6" />
            <span className="text-sm">Alert</span>
          </Link>
        </div>
      </nav> */}
    </div>
  );
};

export default Page;