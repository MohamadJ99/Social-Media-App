
"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Flag, X } from "lucide-react";

import { ApiError } from "@/lib/api";
import { useCreateReport } from "@/hooks/reports/useCreateReport";
import type {
  ReportReason,
  ReportTarget,
} from "@/types/report";

type ReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTarget;
  targetId: number;
};

const reasons: { value: ReportReason; label: string }[] = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "hate_speech", label: "Hate speech" },
  { value: "violence", label: "Violence" },
  { value: "nudity", label: "Nudity or sexual content" },
  { value: "misinformation", label: "Misinformation" },
  { value: "other", label: "Other" },
];

export default function ReportModal({
  isOpen,
  onClose,
  targetType,
  targetId,
}: ReportModalProps) {
  const [reason, setReason] = useState<ReportReason | "">("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);

  const titleId = useId();
  const descriptionId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const reportMutation = useCreateReport();

  const isPending = reportMutation.isPending;

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        onClose();
      }

      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), textarea:not([disabled]), input:not([disabled])'
      );

      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, isPending, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const handleClose = () => {
    if (isPending) return;

    onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!reason || isPending || success) return;

    reportMutation.mutate(
      {
        targetType,
        targetId,
        reason,
        description,
      },
      {
        onSuccess: () => {
          setSuccess(true);
        },
      }
    );
  };

  const errorMessage =
    reportMutation.error instanceof ApiError
      ? reportMutation.error.status === 409
        ? "You have already reported this content."
        : reportMutation.error.message
      : reportMutation.error instanceof Error
        ? reportMutation.error.message
        : "Unable to submit your report.";

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-purple-600" />
            <h2
              id={titleId}
              className="text-lg font-semibold text-gray-900"
            >
              Report {targetType === "post" ? "Post" : "Comment"}
            </h2>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={handleClose}
            disabled={isPending}
            aria-label="Close report dialog"
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Your report has been submitted successfully.
              Thank you for helping keep MJ SOCIAL safe.
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-xl bg-purple-600 px-4 py-2.5 font-medium text-white hover:bg-purple-700"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p
              id={descriptionId}
              className="text-sm text-gray-500"
            >
              Tell us why you are reporting this content.
            </p>

            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm font-medium text-gray-700">
                Reason
              </legend>

              {reasons.map((item) => (
                <label
                  key={item.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 hover:border-purple-300 hover:bg-purple-50"
                >
                  <input
                    type="radio"
                    name="report-reason"
                    value={item.value}
                    checked={reason === item.value}
                    onChange={() => {
                      setReason(item.value);
                      reportMutation.reset();
                    }}
                    disabled={isPending}
                    className="accent-purple-600"
                  />
                  <span className="text-sm text-gray-700">
                    {item.label}
                  </span>
                </label>
              ))}
            </fieldset>

            <div>
              <label
                htmlFor="report-description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Additional details (optional)
              </label>

              <textarea
                id="report-description"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  reportMutation.reset();
                }}
                rows={3}
                maxLength={1000}
                disabled={isPending}
                placeholder="Provide more context..."
                className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

              <p className="mt-1 text-right text-xs text-gray-400">
                {description.length}/1000
              </p>
            </div>

            {reportMutation.isError && (
              <p role="alert" className="text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!reason || isPending}
                className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
