"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import { useState } from "react";

export function LanguageSwitch() {
  const [currentLang, setCurrentLang] = useState<"en" | "mu">("en");

  const handleSwitch = () => {
    setCurrentLang(currentLang === "en" ? "mu" : "en");
  };

  return (
    <Button
      variant="outline"
      className="rounded-full px-4 py-2 transition-all duration-300 relative min-w-[200px]"
      onClick={handleSwitch}
    >
      <div className="flex justify-center items-center w-full">
        <span
          className={`absolute transition-all duration-300 text-sm ${
            currentLang === "en" ? "left-4" : "right-4 text-gray-500"
          }`}
        >
          English
        </span>
        <ArrowLeftRight className="h-4 w-4" />
        <span
          className={`absolute transition-all duration-300 text-sm ${
            currentLang === "mu" ? "left-4" : "right-4 text-gray-500"
          }`}
        >
          Mauritian
        </span>
      </div>
    </Button>
  );
}
