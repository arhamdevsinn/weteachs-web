import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { CornerUpLeft, Save, AlertTriangle, Copy, Trash, X } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  message?: string;
  imageUrl?: string;
  isMine?: boolean;
  onReply?: () => void;
  onSaveEdit?: () => void;
  onReport?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
};

const MessageDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  message,
  imageUrl,
  isMine,
  onReply,
  onSaveEdit,
  onReport,
  onCopy,
  onDelete,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="max-w-md w-[90vw] bg-white rounded-lg border-2 border-[#e6efe6] shadow-lg p-4">
          {/* Only one close icon (Dialog's default) should be present */}
          {imageUrl ? (
            <div className="mb-4">
              {/* Image preview; responsive */}
              <img src={imageUrl} alt="preview" className="w-full h-auto rounded-md" />
            </div>
          ) : (
            <div className="mb-4">
              <textarea
                className="w-full border border-[#e6efe6] rounded-md text-gray-800 min-h-[48px] resize-none bg-white p-3"
                value={message || ""}
                readOnly
                style={{overflowWrap: 'break-word', whiteSpace: 'pre-line'}}
              />
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button onClick={onReply} className="flex items-center gap-3 px-3 py-2 border rounded-md">
              <CornerUpLeft className="w-5 h-5" />
              <span>Reply</span>
            </button>

            {isMine && (
              <button onClick={onSaveEdit} className="flex items-center gap-3 px-3 py-2 border rounded-md">
                <Save className="w-5 h-5" />
                <span>Edit</span>
              </button>
            )}


            {!isMine && (
              <button onClick={onReport} className="flex items-center gap-3 px-3 py-2 border rounded-md">
                <AlertTriangle className="w-5 h-5" />
                <span>Report</span>
              </button>
            )}

            <div className="flex items-center justify-between mt-2">
              <button onClick={onCopy} className="p-3 border rounded-md">
                <Copy className="w-5 h-5" />
              </button>
              {isMine && (
                <button onClick={onDelete} className="p-3 border rounded-md text-red-500">
                  <Trash className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
