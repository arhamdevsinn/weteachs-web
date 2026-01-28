import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Camera } from "lucide-react";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  name: string;
  message: string;
  onSubmit: (data: {
    report_message: string;
    reporte_image: string;
    reporter_uploaded_ss: string;
    message_ref: string;
  }) => void;
  loading?: boolean;
}

const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  onOpenChange,
  name,
  message,
  onSubmit,
  loading,
}) => {
  const [reportMessage, setReportMessage] = useState("");
  const [screenshot, setScreenshot] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // TODO: upload logic here, setScreenshot(url)
    setTimeout(() => {
      setScreenshot("uploaded_image_url");
      setUploading(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      report_message: reportMessage,
      reporte_image: "", // not used in UI
      reporter_uploaded_ss: screenshot,
      message_ref: message,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report</DialogTitle>
          <p className="text-sm text-gray-600">Fill out the form below to submit a ticket.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block font-bold mb-1">Name</label>
            <div className="border-b-2 border-green-900 py-1">{name}</div>
          </div>
          <div>
            <label className="block font-bold mb-1">Message</label>
            <textarea
              className="w-full border-b-2 border-green-900 bg-transparent py-2 px-1 mt-1 resize-none"
              value={message || ""}
              readOnly
              style={{overflowWrap: 'break-word', whiteSpace: 'pre-line'}}
            />
          </div>
          <textarea
            className="w-full border-b-2 border-green-900 bg-transparent py-2 px-1 mt-2"
            placeholder="Short Description of what is going on..."
            value={reportMessage}
            onChange={e => setReportMessage(e.target.value)}
            required
          />
          <div className="flex flex-col gap-2">
            <label className="block font-bold mb-1">Upload Screenshot</label>
            <label className="flex items-center border-2 border-green-900 rounded-lg px-4 py-2 cursor-pointer gap-2">
              <Camera className="w-6 h-6" />
              <span>Upload Screenshot</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
            {uploading && <span className="text-xs text-gray-500">Uploading...</span>}
            {screenshot && <span className="text-xs text-green-700">Screenshot uploaded</span>}
          </div>
          <button
            type="submit"
            className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 mt-4"
            disabled={loading}
          >
            <span className="material-icons">event_note</span> Submit Ticket
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
