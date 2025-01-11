"use client";
import { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { cn } from "@/lib/utils";
import { submitWord } from "@/app/actions";
import { PlusCircle, MinusCircle, MessageCircle } from "lucide-react";

interface SuggestionFormProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const SuggestionForm: React.FC<SuggestionFormProps> = ({
  onSuccess,
  onError,
}) => {
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    if (isFormExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFormExpanded]);

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await submitWord({
        mauritian: formData.get("mauritian") as string,
        english: formData.get("english") as string,
      });
      if (result.success) {
        if (formRef.current) {
          formRef.current.reset();
          setIsFormExpanded(false);
        }
        onSuccess("Thank you! Your word suggestion has been submitted.");
      } else {
        setFormError(true);
        onError(result.error || "Failed to submit suggestion");
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } catch {
      setFormError(true);
      onError("An error occurred while submitting your suggestion");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div
      className="rounded-sm bg-neutral-100/80 overflow-hidden"
      role="region"
      aria-label="Word suggestion form"
    >
      <button
        type="button"
        onClick={() => setIsFormExpanded(!isFormExpanded)}
        className={cn(
          "flex w-full items-center gap-4 px-3 py-2.5",
          "text-sm text-neutral-900",
          "transition-all duration-200 ease-out",
          "hover:bg-white/50",
          "group"
        )}
        aria-expanded={isFormExpanded ? "true" : "false"}
        aria-controls="suggestion-form"
      >
        <div
          className="flex items-center text-neutral-500 group-hover:text-neutral-800 transition-colors"
          aria-hidden="true"
        >
          {isFormExpanded ? (
            <MinusCircle className="h-[18px] w-[18px]" />
          ) : (
            <PlusCircle className="h-[18px] w-[18px]" />
          )}
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <span className="font-medium tracking-tight">
            Contribute to our dictionary
          </span>
          <span className="text-xs text-neutral-500">
            Share your knowledge of Mauritian Creole with others
          </span>
        </div>
      </button>

      <form
        ref={formRef}
        id="suggestion-form"
        action={handleSubmit}
        className={cn(
          "grid grid-rows-[0fr] transition-all duration-200 ease-out bg-neutral-200/30",
          isFormExpanded && "grid-rows-[1fr]"
        )}
        aria-hidden={isFormExpanded ? "false" : "true"}
      >
        <div className="min-h-0">
          <div
            className={cn(
              "flex flex-col gap-3 p-3 opacity-0 transition-opacity duration-200",
              isFormExpanded && "opacity-100"
            )}
          >
            <div className="space-y-1.5">
              <label
                htmlFor="mauritian"
                className="block text-sm font-medium text-neutral-900"
              >
                Mauritian Creole Word
                <span className="text-red-600 ml-0.5" aria-hidden="true">
                  *
                </span>
                <span className="sr-only">(required)</span>
              </label>
              <Input
                ref={inputRef}
                type="text"
                name="mauritian"
                id="mauritian"
                required
                autoComplete="off"
                className={cn(
                  "bg-white/90",
                  "focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400",
                  "text-neutral-900 placeholder:text-neutral-500",
                  formError && "border-red-500"
                )}
                placeholder="e.g., lakaz"
                onChange={() => setFormError(false)}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="english"
                className="block text-sm font-medium text-neutral-900"
              >
                English Translation
                <span className="text-red-600 ml-0.5" aria-hidden="true">
                  *
                </span>
                <span className="sr-only">(required)</span>
              </label>
              <Input
                type="text"
                name="english"
                id="english"
                required
                autoComplete="off"
                className={cn(
                  "bg-white/90",
                  "focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400",
                  "text-neutral-900 placeholder:text-neutral-500",
                  formError && "border-red-500"
                )}
                placeholder="e.g., house"
                onChange={() => setFormError(false)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <SubmitButton />
              <p className="text-xs text-neutral-700 text-center" role="status">
                Your contribution helps preserve and share Mauritian culture
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
