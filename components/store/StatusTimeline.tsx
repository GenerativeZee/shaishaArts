import React from "react";
import { ORDER_STATUSES, STATUS_LABELS, STATUS_ICONS, getStatusIndex } from "@/lib/constants";

interface StatusTimelineProps {
  currentStatus: string;
  history?: { status: string; changedAt: string }[];
}

export default function StatusTimeline({ currentStatus, history = [] }: StatusTimelineProps) {
  const currentIdx = getStatusIndex(currentStatus);

  const getTimestamp = (status: string) => {
    const entry = history.find((h) => h.status === status);
    if (!entry) return null;
    return new Date(entry.changedAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full">
      <div className="relative">
        {ORDER_STATUSES.map((status, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isPending = idx > currentIdx;
          const timestamp = getTimestamp(status);

          return (
            <div key={status} className="flex gap-4 mb-0">
              {/* Left: icon + connector line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold border-2 shrink-0 transition-all ${
                    isDone
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : isCurrent
                      ? "bg-[#8B1A4A] border-[#8B1A4A] text-white ring-4 ring-rose-100"
                      : "bg-white border-gray-200 text-gray-300"
                  }`}
                >
                  {isDone ? "✓" : STATUS_ICONS[status]}
                </div>
                {idx < ORDER_STATUSES.length - 1 && (
                  <div
                    className={`w-0.5 h-8 mt-1 ${
                      isDone ? "bg-emerald-400" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>

              {/* Right: label + timestamp */}
              <div className="pb-8 pt-1.5 flex flex-col">
                <span
                  className={`text-sm font-bold ${
                    isDone
                      ? "text-emerald-600"
                      : isCurrent
                      ? "text-[#8B1A4A]"
                      : "text-gray-400"
                  }`}
                >
                  {STATUS_LABELS[status]}
                  {isCurrent && (
                    <span className="ml-2 text-[10px] bg-rose-100 text-[#8B1A4A] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Current
                    </span>
                  )}
                </span>
                {timestamp && (
                  <span className="text-xs text-gray-400 mt-0.5">{timestamp}</span>
                )}
                {isPending && !timestamp && (
                  <span className="text-xs text-gray-300 mt-0.5">Pending</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
