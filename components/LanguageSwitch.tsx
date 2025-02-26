"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageSwitch() {
  return (
    <Button variant="outline" className="rounded-full px-4 py-2 min-w-[200px]">
      <div className="flex justify-between items-center w-full gap-2">
        <span className={cn("text-sm", "text-gray-500")}>English</span>
        <ArrowLeftRight className="h-4 w-4 flex-shrink-0" />
        <span className={cn("text-sm", "text-gray-500")}>Mauritian</span>
      </div>
    </Button>
  );
}
