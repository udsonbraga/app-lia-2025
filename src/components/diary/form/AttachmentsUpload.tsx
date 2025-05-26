
import { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileAttachment, UploadProgress } from "../../../hooks/useFileUpload";

interface AttachmentsUploadProps {
  attachments: File[];
  attachmentPreviews: FileAttachment[];
  uploadProgress: UploadProgress;
  onAttachmentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AttachmentsUpload = ({
  attachments,
  attachmentPreviews,
  uploadProgress,
  onAttachmentChange,
}: AttachmentsUploadProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("file-input")?.click()}
          className="flex items-center gap-2"
        >
          <Camera className="h-6 w-6" />
          Capturar
        </Button>
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={onAttachmentChange}
        />
      </div>

      {attachmentPreviews.length > 0 && (
        <div className="space-y-2 mt-2">
          <p className="text-sm font-medium text-gray-700">Pré-visualização:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {attachmentPreviews.map((preview, index) => (
              <div key={index} className="border rounded-md p-2">
                <img
                  src={preview.url}
                  alt={preview.file.name}
                  className="h-40 w-full object-cover rounded mb-2"
                />
                <p className="text-xs text-gray-600 truncate">{preview.file.name}</p>
                {uploadProgress[preview.file.name] > 0 && uploadProgress[preview.file.name] < 100 && (
                  <div className="w-full bg-gray-200 h-1 mt-1 rounded-full">
                    <div
                      className="bg-blue-500 h-1 rounded-full"
                      style={{ width: `${uploadProgress[preview.file.name]}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Anexos:</p>
          <ul className="space-y-2">
            {attachments.map((file, index) => (
              <li key={index} className="text-sm text-gray-600">
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AttachmentsUpload;
