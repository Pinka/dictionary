"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

export function VoiceSearch() {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = async () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    // Implementation of voice search logic here
    setIsListening(!isListening);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleVoiceSearch}
      className={`${isListening ? "text-red-500" : ""}`}
    >
      <Mic className="h-5 w-5" />
    </Button>
  );
}
