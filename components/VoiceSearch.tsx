"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Settings, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Add global type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: {
      new (): SpeechRecognition;
      prototype: SpeechRecognition;
    };
    webkitSpeechRecognition?: {
      new (): SpeechRecognition;
      prototype: SpeechRecognition;
    };
  }
}

// Define speech recognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: {
    transcript: string;
  };
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: (event: Event) => void;
}

// Get the SpeechRecognition constructor
const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? ((window.SpeechRecognition || window.webkitSpeechRecognition || null) as {
        new (): SpeechRecognition;
      })
    : null;

// Permission states
type PermissionState = "prompt" | "granted" | "denied" | "unsupported";

export const VoiceSearch: React.FC<{
  onResult?: (result: string) => void;
}> = ({ onResult }) => {
  // State
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionState, setPermissionState] = useState<PermissionState>(
    SpeechRecognitionAPI ? "prompt" : "unsupported"
  );
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check for microphone permission on mount
  useEffect(() => {
    checkPermissionState();
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!SpeechRecognitionAPI) return;

    const recognitionInstance = new SpeechRecognitionAPI();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = "en-US"; // Default language

    recognitionInstance.onresult = (event) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript.trim();

      if (onResult && transcript) {
        onResult(transcript);
      }

      setIsListening(false);
      setIsLoading(false);
    };

    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error", event);

      if (event.error === "not-allowed") {
        setPermissionState("denied");
        setErrorMessage("Microphone access was denied");
      } else if (event.error === "no-speech") {
        setErrorMessage("No speech detected. Please try again.");
      } else if (event.error === "network") {
        setErrorMessage("Network error. Please check your connection.");
      } else {
        setErrorMessage(`Error: ${event.error || "Unknown error"}`);
      }

      setIsListening(false);
      setIsLoading(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      setIsLoading(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [onResult]);

  // Check current permission state
  const checkPermissionState = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionState("unsupported");
      return;
    }

    try {
      // Try to check existing permission state
      if (navigator.permissions && navigator.permissions.query) {
        const permissionStatus = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });

        if (permissionStatus.state === "granted") {
          setPermissionState("granted");
        } else if (permissionStatus.state === "denied") {
          setPermissionState("denied");
        } else {
          setPermissionState("prompt");
        }

        // Listen for permission changes
        permissionStatus.onchange = () => {
          setPermissionState(permissionStatus.state as PermissionState);
        };

        return;
      }

      // Fallback: Try to access the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setPermissionState("granted");
    } catch (err) {
      console.error("Permission check error:", err);
      setPermissionState("denied");
    }
  };

  // Request microphone permission explicitly
  const requestMicrophonePermission = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setPermissionState("granted");
      setShowPermissionDialog(false);
      return true;
    } catch (err) {
      console.error("Failed to get microphone permission:", err);
      setPermissionState("denied");
      setErrorMessage(
        "Microphone permission denied. Please allow access in your browser settings."
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voice search button click
  const handleVoiceSearch = useCallback(() => {
    setErrorMessage(null);

    if (!SpeechRecognitionAPI) {
      setErrorMessage("Voice search is not supported in this browser");
      return;
    }

    if (!recognition) {
      setErrorMessage("Speech recognition not initialized");
      return;
    }

    // Start listening
    const startListening = () => {
      if (!recognition) return;

      setIsLoading(true);
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition", err);
        setErrorMessage("Failed to start voice recognition");
        setIsLoading(false);
      }
    };

    // If currently listening, stop
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setIsLoading(false);
      return;
    }

    // Check permission state
    if (permissionState === "denied") {
      setShowPermissionDialog(true);
      return;
    }

    if (permissionState === "prompt") {
      requestMicrophonePermission().then((success) => {
        // Start listening if permission was granted
        if (success) {
          startListening();
        }
      });
      return;
    }

    // Permission already granted
    startListening();
  }, [recognition, isListening, permissionState]);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Determine button color and icon based on state
  const buttonIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (permissionState === "denied") return <MicOff className="h-4 w-4" />;
    return <Mic className="h-4 w-4" />;
  };

  const buttonClass = cn(
    "h-8 w-8 rounded-full hover:bg-gray-100",
    isListening && "text-red-500 animate-pulse",
    permissionState === "denied" && "text-gray-400"
  );

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleVoiceSearch}
          className={buttonClass}
          disabled={isLoading && !isListening}
          aria-label="Voice search"
          title={
            permissionState === "denied"
              ? "Microphone access denied"
              : "Search by voice"
          }
        >
          {buttonIcon()}
        </Button>

        {errorMessage && (
          <div className="absolute right-0 top-full mt-2 z-50 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded shadow-md max-w-[250px] w-max">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Permission dialog */}
      <Dialog
        open={showPermissionDialog}
        onOpenChange={setShowPermissionDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Microphone Permission Required</DialogTitle>
            <DialogDescription>
              Voice search requires microphone access. Please allow access in
              your browser settings.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 p-4 bg-muted rounded-md">
            <h4 className="font-medium mb-2">
              How to enable microphone access:
            </h4>
            <ol className="list-decimal ml-5 text-sm space-y-1">
              <li>
                Look for the camera/microphone icon in your browser address bar
              </li>
              <li>Click on it and select &quot;Allow&quot; for microphone</li>
              <li>Refresh the page after changing permissions</li>
            </ol>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPermissionDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                requestMicrophonePermission();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Settings className="h-4 w-4 mr-2" />
              )}
              Request Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
