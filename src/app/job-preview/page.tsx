// @ts-nocheck
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  DocumentReference,
  FieldValue,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase/config";
import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/src/components/ui/dialog";

type NotificationData = {
  id: string;
  student_name?: string;
  teacher_name?: string;
  topic?: string;
  questions?: string;
  hired_time_amount?: string;
  hired_price?: string;
  when_job_date_time?: string;
  student_profile_pic?: string;
  teacher_profile_pic?: string;
  did_didnt_accept?: string;
  type?: string;
  chat_ref?: unknown;
  jobstream_ref?: unknown;
  student_ref?: unknown;
  teacher_ref?: unknown;
  limbo_ref?: unknown;
  receiver_ref?: unknown;
  student_notification_ref?: unknown;
};

type LimboUserData = {
  stripeAccountID?: string;
};

type ChatData = {
  users: (DocumentReference | null)[];
  userNames: (string | undefined)[];
  last_message: string;
  last_message_time: FieldValue;
  modified_time: FieldValue;
  limboref: DocumentReference | null;
  limboref2: DocumentReference | null;
  paid_chat: boolean;
  chat_name: string | undefined;
  student_ref: DocumentReference | null;
  teacher_ref: DocumentReference | null;
  teacherStripeID: string;
  studentStripeID: string;
  chat_paid_for: boolean;
  job_ref: DocumentReference | null;
  home_chat: boolean;
  completed: boolean;
  Reviewed: boolean;
  stream_chat: boolean;
};

const getRefId = (ref: unknown) => {
  if (!ref) return "";
  if (typeof ref === "string") {
    return ref.split("/").filter(Boolean).pop() || "";
  }
  if (typeof ref === "object") {
    const refObj = ref as { id?: string; path?: string };
    if (refObj.id) return refObj.id;
    if (refObj.path) return refObj.path.split("/").filter(Boolean).pop() || "";
  }
  return "";
};

const getDocRef = (ref: unknown, fallbackCollection?: string) => {
  if (!ref) return null;

  if (typeof ref === "string") {
    const path = ref.startsWith("/") ? ref.slice(1) : ref;
    return doc(db, path);
  }

  if (typeof ref === "object") {
    const refObj = ref as { id?: string; path?: string };
    if (refObj.path) return doc(db, refObj.path);
    if (refObj.id && fallbackCollection) return doc(db, fallbackCollection, refObj.id);
  }

  return null;
};

const JobPreviewPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useAuth();
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [denying, setDenying] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  const notificationId = searchParams.get("notificationId") || "";

  useEffect(() => {
    const fetchNotification = async () => {
      if (!notificationId) {
        setError("Missing notification id.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const docRef = doc(db, "Notifications", notificationId);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          setError("Notification not found.");
          setNotification(null);
          return;
        }

        setNotification({ id: snap.id, ...(snap.data() as NotificationData) });
      } catch (err) {
        console.error("Failed to load notification", err);
        setError("Failed to load notification.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, [notificationId]);

  const isTeacher = Boolean(profile?.isTeacher);
  const status = (notification?.did_didnt_accept || "").toLowerCase();

  const showAcceptDeny = isTeacher && status === "no";
  const showStartChat = !isTeacher && status === "accepted";

  const totalLabel = notification?.hired_price || "$0.00";
  const timeLabel = notification?.hired_time_amount || "";
  const whenLabel = notification?.when_job_date_time || "";
  const primaryName =
    notification?.student_name || notification?.teacher_name || "Unknown";

  const headerLabel = useMemo(() => {
    if (notification?.topic) return notification.topic;
    return "Job";
  }, [notification?.topic]);

  const handleAccept = async () => {
    if (!notificationId) return;
    try {
      setAccepting(true);
      const jobStreamRef = getDocRef(notification?.jobstream_ref, "JobStream");
      if (jobStreamRef) {
        await updateDoc(jobStreamRef, { accepted: true });
      }

      const docRef = doc(db, "Notifications", notificationId);
      await updateDoc(docRef, { did_didnt_accept: "Accepted", read_status: true });

      const studentNotificationRef = getDocRef(
        notification?.student_notification_ref,
        "Notifications"
      );

      if (studentNotificationRef) {
        await updateDoc(studentNotificationRef, {
          did_didnt_accept: "Accepted",
          read_status: false,
          message: "Accepted your job",
        });
      }

      setNotification((prev) => (prev ? { ...prev, did_didnt_accept: "Accepted" } : prev));
      toast.success("Wait for student to start the job.");
      router.push("/notifications");
    } catch (err) {
      console.error("Failed to accept job", err);
      toast.error("Failed to accept job. Please try again.");
    } finally {
      setAccepting(false);
    }
  };

  const handleDeny = async () => {
    if (!notificationId) return;
    try {
      setDenying(true);
      const docRef = doc(db, "Notifications", notificationId);
      await updateDoc(docRef, { did_didnt_accept: "Denied", read_status: true });
      setNotification((prev) => (prev ? { ...prev, did_didnt_accept: "Denied" } : prev));
    } catch (err) {
      console.error("Failed to deny job", err);
    } finally {
      setDenying(false);
    }
  };

  const handleStartChat = async () => {
    if (!notification || !profile) {
      toast.error("Missing notification or profile data.");
      return;
    }

    try {
      setStartingChat(true);
      const studentDetailsRef = getDocRef(
        notification.student_ref,
        "StudentDetails"
      );
      const teacherDetailsRef = getDocRef(
        notification.teacher_ref,
        "TeacherDetails"
      );

      if (!studentDetailsRef || !teacherDetailsRef) {
        toast.error("Student or teacher details reference not found.");
        return;
      }

      const studentDetailsDoc = await getDoc(studentDetailsRef);
      const teacherDetailsDoc = await getDoc(teacherDetailsRef);

      const studentLimboRef = studentDetailsDoc.data()?.limbo_ref;
      const teacherLimboRef = teacherDetailsDoc.data()?.limbo_ref;

      if (!studentLimboRef || !teacherLimboRef) {
        toast.error("Student or teacher limbo reference not found.");
        return;
      }

      const studentLimboDocRef = getDocRef(studentLimboRef, "LimboUserMode");
      const teacherLimboDocRef = getDocRef(teacherLimboRef, "LimboUserMode");

      if (!studentLimboDocRef || !teacherLimboDocRef) {
        toast.error("Student or teacher limbo document reference not found.");
        return;
      }

      const studentDoc = await getDoc(studentLimboDocRef);
      const teacherDoc = await getDoc(teacherLimboDocRef);

      const studentStripeID =
        (studentDoc.data() as LimboUserData)?.stripeAccountID || "";
      const teacherStripeID =
        (teacherDoc.data() as LimboUserData)?.stripeAccountID || "";

      // 1. Create a new chat document
      const chatData: ChatData = {
        users: [studentLimboDocRef, teacherLimboDocRef],
        userNames: [notification.student_name, notification.teacher_name],
        last_message: "Say Hello!",
        last_message_time: serverTimestamp(),
        modified_time: serverTimestamp(),
        limboref: studentLimboDocRef,
        limboref2: teacherLimboDocRef,
        paid_chat: true,
        chat_name: notification.topic,
        student_ref: studentDetailsRef,
        teacher_ref: teacherDetailsRef,
        teacherStripeID: teacherStripeID,
        studentStripeID: studentStripeID,
        chat_paid_for: false,
        job_ref: getDocRef(notification.jobstream_ref, "JobStream"),
        home_chat: false,
        completed: false,
        Reviewed: false, // Firestore fields are case-sensitive. 'Reviewed' vs 'reviewed'
        stream_chat: true,
      };
      const chatRef = await addDoc(collection(db, "chats"), chatData);

      // 2. Update the job stream with the new chat reference
      const jobStreamRef = getDocRef(notification.jobstream_ref, "JobStream");
      if (jobStreamRef) {
        const jobStreamDoc = await getDoc(jobStreamRef);
        if (jobStreamDoc.exists()) {
          await updateDoc(jobStreamRef, { chat_ref: chatRef });
        } else {
          console.warn("JobStream document not found, skipping update.");
        }
      }

      // 3. Update the notification with the new chat reference
      const notificationRef = doc(db, "Notifications", notificationId);
      await updateDoc(notificationRef, { chat_ref: chatRef });

      // 4. Navigate to the new chat
      router.push(`/chat`);
      toast.success("Chat started successfully!");
    } catch (err) {
      console.error("Failed to start chat", err);
      toast.error("Failed to start chat. Please try again.");
    } finally {
      setStartingChat(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e2e6ea]">
      <header className="sticky top-0 z-10 bg-[#1f6f3f] px-4 pb-4 pt-6 shadow-sm">
        <div className="mx-auto flex w-full max-w-xl items-center gap-3">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => router.back()}
            className="rounded-full p-2 text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-semibold text-white">Job Preview</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl px-4 pb-12 pt-6">
        {loading ? (
          <div className="rounded-2xl border border-[#c8d2d8] bg-white px-4 py-6 text-center text-lg text-black/70">
            Loading job...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-2xl border border-red-200 bg-white px-4 py-6 text-center text-lg text-red-600">
            {error}
          </div>
        ) : null}

        {!loading && !error && notification ? (
          <div className="rounded-3xl bg-[#dfe3e6] px-4 py-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xl font-semibold text-black">{primaryName}</div>
                <div className="text-sm font-medium text-black/70">Language</div>
                <div className="mt-1 text-sm font-semibold text-[#4468c2]">
                  {timeLabel ? `${timeLabel} ` : ""}
                  {whenLabel ? `on ${whenLabel}` : ""}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-black">{headerLabel}</div>
                <div className="mt-3 text-lg font-semibold text-black">
                  Total : {totalLabel}
                </div>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl">
              <Image
                src={
                  notification.student_profile_pic ||
                  notification.teacher_profile_pic ||
                  "/logo.png"
                }
                alt="Job preview"
                width={720}
                height={420}
                className="h-[220px] w-full object-cover"
              />
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-full border border-[#4f7b5f] bg-white px-4 py-2 text-center text-base font-semibold text-black">
                Topic : {notification.topic || "-"}
              </div>
              <div className="rounded-full border border-[#4f7b5f] bg-white px-4 py-2 text-center text-base font-semibold text-black">
                Questions : {notification.questions || "-"}
              </div>
            </div>

            {showAcceptDeny ? (
              <div className="mt-8 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={accepting || denying || startingChat}
                  className="h-12 rounded-full bg-primary text-lg font-semibold text-white shadow"
                >
                  {accepting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      ACCEPTING...
                    </span>
                  ) : (
                    "ACCEPT JOB"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDeny}
                  disabled={accepting || denying || startingChat}
                  className="h-12 rounded-full bg-[#cf3a2e] text-lg font-semibold text-white shadow"
                >
                  {denying ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      DENYING...
                    </span>
                  ) : (
                    "DENY JOB"
                  )}
                </button>
              </div>
            ) : null}

            {showStartChat ? (
              <div className="mt-8 flex gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="h-12 w-full rounded-full bg-primary text-lg font-semibold text-white shadow"
                    >
                      Confirm
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        This will start a new chat with the teacher. You cannot
                        undo this action.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <button type="button" disabled={startingChat}>Cancel</button>
                      </DialogClose>
                      <button
                        type="button"
                        onClick={handleStartChat}
                        disabled={startingChat || accepting || denying}
                      >
                        {startingChat ? (
                          <span className="inline-flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Starting...
                          </span>
                        ) : (
                          "Confirm"
                        )}
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <button
                  type="button"
                  onClick={() => router.push("/notifications")}
                  disabled={startingChat}
                  className="h-12 w-full rounded-full bg-primary text-lg font-semibold text-white shadow"
                >
                  Back
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default JobPreviewPage;
