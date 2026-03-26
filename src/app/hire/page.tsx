// @ts-nocheck
"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Camera, ChevronDown, DollarSign, ShieldCheck, Timer } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useAuth } from "@/src/hooks/useAuth";
import { useUploadImage } from "@/src/hooks/useUploadImage";
import { db, serverTimestamp } from "@/src/lib/firebase/config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

const LENGTH_OPTIONS = [15, 30, 45, 60];

const HirePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const teacherId = searchParams.get("teacherId") || "";
  const teacherName = searchParams.get("teacherName") || "Expert";
  const teacherPhoto = searchParams.get("teacherPhoto") || "/splash_screen.png";
  const teacherRate = Number(searchParams.get("liveRate") || 0);
  const teacherLanguage = searchParams.get("language") || "Language";
  const teacherTopic = searchParams.get("topic") || "";

  const [jobLength, setJobLength] = useState("15");
  const [availability, setAvailability] = useState("");
  const [fixedRate, setFixedRate] = useState("");
  const [topic, setTopic] = useState(teacherTopic);
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState("");
  const [videoOrChat, setVideoOrChat] = useState("Chat");
  const [submitting, setSubmitting] = useState(false);
  const [stripeDialogOpen, setStripeDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [jobStreamRef, setJobStreamRef] = useState(null);
  const [receiver_ref, setReceiver_ref] = useState(null);
  const [studentRefState, setStudentRefState] = useState(null);
  const [limboRefState, setLimboRefState] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const { uploadImage, uploading: imageUploading } = useUploadImage();

  const liveRatePer15 = Number.isFinite(teacherRate) && teacherRate > 0 ? teacherRate : 15;

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadImage(file, `jobs/${user?.uid}`);
      setUploadedImageUrl(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      // Upload to Firebase
      handleImageUpload(file);
    }
  };

  const computedPrice = useMemo(() => {
    const lengthMins = Number(jobLength) || 15;
    const enteredRate = fixedRate.trim() ? Number(fixedRate) : NaN;

    if (Number.isFinite(enteredRate) && enteredRate >= 0) {
      return Number(enteredRate.toFixed(2));
    }

    return Number(((liveRatePer15 / 15) * lengthMins).toFixed(2));
  }, [fixedRate, jobLength, liveRatePer15]);

  const createJob = async () => {
    if (!user?.uid) {
      toast.error("Please log in to hire an expert");
      router.push("/auth/login");
      return;
    }

    if (!teacherId) {
      toast.error("Teacher information is missing");
      return;
    }

    if (!availability) {
      toast.error("Please select availability");
      return;
    }

    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    setSubmitting(true);

    try {
      const limboRef = doc(db, "LimboUserMode", user.uid);
      const limboSnap = await getDoc(limboRef);

      if (!limboSnap.exists()) {
        throw new Error("Student profile not found");
      }

      const limboData = limboSnap.data();
      const studentStripeID =
        limboData?.stripeAccountID ||
        limboData?.stripeAccountId ||
        limboData?.stripe_id ||
        "";

      if (!studentStripeID) {
        setStripeDialogOpen(true);
        return;
      }

      const studentRefRaw = limboData?.student_ref;
      let studentRef = doc(db, "StudentDetails", user.uid);

      if (studentRefRaw && typeof studentRefRaw === "object" && studentRefRaw.path) {
        studentRef = studentRefRaw;
      } else if (typeof studentRefRaw === "string" && studentRefRaw.trim()) {
        studentRef = doc(db, studentRefRaw.replace(/^\//, ""));
      }

      const teacherRef = doc(db, "TeacherDetails", teacherId);

      const lengthMins = Number(jobLength) || 15;
      const jobLengthPrice = Math.max(1, Math.round(lengthMins / 15));
      const totalPrice = Number(computedPrice.toFixed(2));
      const weteachFee = 1;
      const totalAfterTaxes = Number((totalPrice + weteachFee).toFixed(2));

      const parsedAvailability = new Date(availability);
      const jobDateTime = Number.isNaN(parsedAvailability.getTime())
        ? Timestamp.now()
        : Timestamp.fromDate(parsedAvailability);

      const fixedPriceValue = fixedRate.trim() ? parseInt(fixedRate, 10) : null;

      const jobDocRef = await addDoc(collection(db, "JobStream"), {
        Expert_created: true,
        Expert_notes: questions.trim(),
        Job_description: description.trim(),
        Student_Name:
          limboData?.display_name ||
          limboData?.displayName ||
          limboData?.name ||
          "Student",
        Unavailable: false,
        accepted: true,
        fixed_price: fixedPriceValue,
        free_chat_Job_creation: videoOrChat === "Chat",
        image_url: uploadedImageUrl || null,
        job_created_time: serverTimestamp(),
        job_date_time: jobDateTime,
        job_length_price: jobLengthPrice,
        job_price: String(totalPrice),
        job_status: "created",
        job_topic: topic.trim(),
        limbo_ref: limboRef,
        open_close: "open",
        studentStripeID,
        student_profile_pic: limboData?.photo_url || "",
        student_ref: studentRef,
        teacher_profile_pic: teacherPhoto,
        teacher_ref: teacherRef,
        topic: topic.trim(),
        total_after_taxes: totalAfterTaxes,
        total_price: totalPrice,
        video_or_chat: videoOrChat,
        weteachfee: weteachFee,
      });

      toast.success("Hire request created successfully");
      setJobStreamRef(jobDocRef);
      setReceiver_ref(teacherRef);
      setStudentRefState(studentRef);
      setLimboRefState(limboRef);
      setReceiptData({
        name:
          limboData?.display_name ||
          limboData?.displayName ||
          limboData?.name ||
          "Student",
        availability,
        topic: topic.trim(),
        description: description.trim(),
        questions: questions.trim(),
        rate: totalPrice,
        lengthLabel: `${lengthMins} min`,
        total: totalPrice,
        fee: weteachFee,
        totalAfter: totalAfterTaxes,
        studentProfilePic: limboData?.photo_url || "",
      });
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error("Failed to create hire request", error);
      toast.error("Failed to create hire request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e7ecef] via-[#d4dce1] to-[#c5ced4] px-3 py-4 md:px-6 md:py-8">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-20 top-32 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
      </div>

      <div className="min-h-screen bg-slate-100 py-8 px-4">
  <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">

    {/* Header */}
    <div className="flex items-center gap-3 bg-primary text-white px-6 py-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>
      <span className="text-lg font-semibold">Hire Expert</span>
    </div>

    <div className="p-6 space-y-6">

      {/* Teacher Info */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden">
          <Image
            src={teacherPhoto}
            alt="teacher"
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold">{teacherName}</h2>
          <p className="text-sm text-gray-500">
            ${liveRatePer15} / 15 min
          </p>
        </div>
      </div>

      {/* Choose Length */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Session Length</label>
        <select
          value={jobLength}
          onChange={(e) => setJobLength(e.target.value)}
          className="w-full h-11 rounded-lg border px-3 text-sm"
        >
          {LENGTH_OPTIONS.map((mins) => (
            <option key={mins} value={mins}>
              {mins} min
            </option>
          ))}
        </select>
      </div>

      {/* Availability */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Availability</label>
        <Input
          type="datetime-local"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="h-11"
        />
      </div>

      {/* Fixed Rate */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Fixed Rate</label>
        <Input
          value={fixedRate}
          onChange={(e) => setFixedRate(e.target.value)}
          placeholder="Optional"
          className="h-11"
        />
      </div>

      {/* Upload Image */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Upload Image (Optional)</label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            disabled={imageUploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex items-center justify-center gap-2 h-11 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition"
          >
            <Camera className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">
              {imageUploading ? "Uploading..." : "Click to upload image"}
            </span>
          </label>
        </div>
        {imagePreview && (
          <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={imagePreview}
              alt="preview"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Topic */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Topic</label>
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="h-11"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-24 rounded-lg border p-3 text-sm"
        />
      </div>

      {/* Questions */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Questions</label>
        <textarea
          value={questions}
          onChange={(e) => setQuestions(e.target.value)}
          className="w-full h-24 rounded-lg border p-3 text-sm"
        />
      </div>

      {/* Price Box */}
      <div className="bg-slate-50 rounded-lg p-4 text-sm space-y-1">
        <p>Session Price: ${computedPrice.toFixed(2)}</p>
        <p>Platform Fee: $1</p>
        <p className="font-semibold text-primary">
          Total: ${(computedPrice + 1).toFixed(2)}
        </p>
      </div>

      {/* Hire Button */}
      <Button
        onClick={createJob}
        disabled={submitting}
        className="w-full h-12 text-sm font-semibold"
      >
        {submitting ? "Creating..." : "Hire Expert"}
      </Button>

    </div>
  </div>
</div>

      <Dialog open={stripeDialogOpen} onOpenChange={setStripeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Stripe First</DialogTitle>
            <DialogDescription>
              You need to connect your Stripe account before hiring an expert.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setStripeDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setStripeDialogOpen(false);
                router.push(`/settings?userId=${encodeURIComponent(user?.uid || "")}`);
              }}
            >
              Connect Stripe
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="max-w-3xl border-0 bg-transparent p-0">
          <div className="rounded-3xl border-2 border-primary bg-[#e7ecef] p-6 shadow-xl">
            <div className="flex items-center justify-center">
              <div className="w-full rounded-2xl border-2 border-primary bg-white py-4 text-center text-2xl font-bold text-primary">
                Receipt
              </div>
            </div>

            <div className="mt-6 rounded-xl border-2 border-primary bg-white p-5 text-base leading-6 text-gray-900">
              <h3 className="mb-4 text-center text-2xl font-bold text-primary">
                Payment Information
              </h3>

              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-primary">Name</span>
                  <br />
                  {receiptData?.name || "-"}
                </p>

                <p>
                  <span className="font-semibold text-primary">Date/Time :</span>{" "}
                  {receiptData?.availability
                    ? new Date(receiptData.availability).toLocaleString()
                    : "Not selected"}
                </p>

                <p>
                  <span className="font-semibold text-primary">Topic</span>
                  <br />
                  {receiptData?.topic || "-"}
                </p>

                <p>
                  <span className="font-semibold text-primary">Description</span>
                  <br />
                  {receiptData?.description || "-"}
                </p>

                <p>
                  <span className="font-semibold text-primary">Questions</span>
                  <br />
                  {receiptData?.questions || "No questions"}
                </p>

                <p>
                  <span className="font-semibold text-primary">Rate :</span> ${receiptData?.rate?.toFixed(2) || "0.00"}
                </p>

                <p>
                  <span className="font-semibold text-primary">Length :</span> {receiptData?.lengthLabel || "-"}
                </p>

                <p>
                  <span className="font-semibold text-primary">Total :</span> ${receiptData?.total?.toFixed(2) || "0.00"}
                </p>

                <p>
                  <span className="font-semibold text-primary">Tax/Fees :</span> ${receiptData?.fee?.toFixed(2) || "0.00"}
                </p>

                <p className="font-semibold text-primary">
                  Total after Taxes/Fees : ${receiptData?.totalAfter?.toFixed(2) || "0.00"}
                </p>
              </div>

              <p className="mt-6 text-center text-sm text-gray-600">
                Transactions will only go through if Chat is started by you
              </p>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <Button
                className="h-12 bg-primary text-white hover:bg-primary"
                onClick={async () => {
                  if (!jobStreamRef) {
                    toast.error("Missing job reference; please try again.");
                    return;
                  }

                  try {
                    const studentLimboRef = limboRefState || doc(db, "LimboUserMode", user.uid);
                    const teacherRef = doc(db, "TeacherDetails", teacherId);
                    const studentRef = studentRefState || doc(db, "StudentDetails", user.uid);
                    const teacherSnap = await getDoc(teacherRef);
                    const teacherData = teacherSnap.exists() ? teacherSnap.data() : null;
                    const teacherLimboRef =
                      teacherData?.limbo_ref && typeof teacherData.limbo_ref === "object" && teacherData.limbo_ref.path
                        ? teacherData.limbo_ref
                        : typeof teacherData?.limbo_ref === "string" && teacherData.limbo_ref.trim()
                          ? doc(db, teacherData.limbo_ref.replace(/^\//, ""))
                          : doc(db, "LimboUserMode", teacherId);

                    const studentNotificationRef = await addDoc(collection(db, "Notifications"), {
                      created_time: serverTimestamp(),
                      did_didnt_accept: "no",
                      hired_price: `$${(receiptData?.rate || 0).toFixed(2)}`,
                      hired_time_amount: receiptData?.lengthLabel || `${jobLength}min`,
                      joboffer: "Joboffer",
                      jobstream_ref: jobStreamRef,
                      limbo_ref: studentLimboRef,
                      receiver_ref: studentLimboRef,
                      questions: receiptData?.questions || "",
                      student_name: receiptData?.name || "Student",
                      student_profile_pic: receiptData?.studentProfilePic || "",
                      student_ref: studentRef,
                      teacher_name: teacherName,
                      teacher_ref: teacherRef,
                      topic: receiptData?.topic || topic,
                      type: "Hired",
                      when_job_date_time: receiptData?.availability || "",
                      creater_ref: studentLimboRef,
                      read_status: false,
                      message: "Hire request sent.",
                    });

                    await addDoc(collection(db, "Notifications"), {
                      created_time: serverTimestamp(),
                      did_didnt_accept: "no",
                      hired_price: `$${(receiptData?.rate || 0).toFixed(2)}`,
                      hired_time_amount: receiptData?.lengthLabel || `${jobLength}min`,
                      joboffer: "Joboffer",
                      jobstream_ref: jobStreamRef,
                      limbo_ref: teacherLimboRef,
                      receiver_ref: teacherLimboRef,
                      questions: receiptData?.questions || "",
                      student_name: receiptData?.name || "Student",
                      student_profile_pic: receiptData?.studentProfilePic || "",
                      student_ref: studentRef,
                      teacher_name: teacherName,
                      teacher_ref: teacherRef,
                      topic: receiptData?.topic || topic,
                      type: "Hired",
                      when_job_date_time: receiptData?.availability || "",
                      creater_ref: studentLimboRef,
                      read_status: false,
                      message: "Hired you!",
                      student_notification_ref: studentNotificationRef,
                    });
                    setSuccessDialogOpen(false);
                    router.push("/");
                  } catch (err) {
                    console.error("Failed to notify expert", err);
                    toast.error("Failed to notify expert. Please try again.");
                  }
                }}
              >
                Notify Expert
              </Button>
              <Button
                variant="outline"
                className="h-12 border-gray-300 text-gray-800"
                onClick={() => setSuccessDialogOpen(false)}
              >
                Back
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HirePage;
