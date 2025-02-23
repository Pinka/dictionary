"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

export const VoiceSearch: React.FC<{
  onResult?: (result: string) => void;
}> = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = async () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    setIsListening(!isListening);
    // Example: Set a dummy result
    onResult?.("Voice search result");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleVoiceSearch}
      className={cn(
        "h-8 w-8 rounded-full hover:bg-gray-100",
        isListening && "text-red-500"
      )}
    >
      <Mic className="h-4 w-4" />
    </Button>
  );
};
