"use client";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full bg-neutral-800 text-white px-4 py-2 rounded-sm",
        "hover:bg-neutral-900 active:bg-neutral-950",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-colors duration-200",
        "text-sm font-medium"
      )}
    >
      {pending ? "Submitting..." : "Submit Word"}
    </button>
  );
}
