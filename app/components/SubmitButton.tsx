"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  className?: string;
}

export function SubmitButton({ className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium transition-colors",
        "bg-neutral-700 hover:bg-neutral-800 text-white",
        "disabled:bg-neutral-400 disabled:text-neutral-200 disabled:cursor-not-allowed",
        className
      )}
    >
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}
