import { useState, useEffect } from "react";
import { Send, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSpeechRecognition } from "@/hooks/useVoice";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  voiceEnabled: boolean;
  onVoiceToggle: () => void;
}

export function ChatInput({ onSendMessage, isLoading = false, voiceEnabled, onVoiceToggle }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const { isListening, transcript, isSupported, startListening, stopListening } = useSpeechRecognition();
  const { toast } = useToast();

  // When transcript updates, set it as the message
  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceInput = () => {
    if (!isSupported) {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice input. Try Chrome, Edge, or Safari.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 bg-background/80 backdrop-blur-lg border-t border-border p-4 md:p-6"
      data-testid="chat-input-form"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening..." : "Share what's on your heart and mind..."}
              className="resize-none min-h-[60px] max-h-[200px] pr-12 rounded-xl focus-visible:ring-primary"
              disabled={isLoading || isListening}
              data-testid="input-message"
            />
            {isListening && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-muted-foreground">Recording</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={isListening ? "default" : "ghost"}
              size="icon"
              onClick={handleVoiceInput}
              disabled={isLoading}
              data-testid="button-voice"
              title={isListening ? "Stop recording" : "Start voice input"}
            >
              {isListening ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
              <span className="sr-only">Voice input</span>
            </Button>
            <Button
              type="button"
              variant={voiceEnabled ? "default" : "ghost"}
              size="icon"
              onClick={onVoiceToggle}
              disabled={isLoading}
              data-testid="button-voice-toggle"
              title={voiceEnabled ? "Disable voice responses" : "Enable voice responses"}
            >
              {voiceEnabled ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle voice responses</span>
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || isLoading}
              data-testid="button-send"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
        {isListening && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Speak now... Click the microphone again when finished
          </p>
        )}
      </div>
    </form>
  );
}
