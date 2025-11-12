import { useState, useEffect, useRef } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage, type Message } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useSpeechSynthesis } from "@/hooks/useVoice";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { speak, stop, isSpeaking } = useSpeechSynthesis();

  // Stop speech on component unmount
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        stop();
      }
    };
  }, [isSpeaking, stop]);

  // Load conversation history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(`/api/messages`);
        if (response.ok) {
          const history = await response.json();
          setMessages(history);
        } else if (response.status === 401) {
          window.location.href = "/api/login";
        }
      } catch (error) {
        console.error("Failed to load conversation history:", error);
      }
    };
    if (user) {
      loadHistory();
    }
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    setIsLoading(true);
    
    // Stop any ongoing speech when user sends new message
    if (isSpeaking) {
      stop();
    }

    try {
      const response = await apiRequest("POST", "/api/chat", {
        content,
      });

      const data = await response.json() as {
        userMessage: Message;
        assistantMessage: Message;
      };

      setMessages((prev) => [...prev, data.userMessage, data.assistantMessage]);
      
      // Speak the assistant's response if voice is enabled
      if (voiceEnabled && data.assistantMessage.content) {
        speak(data.assistantMessage.content);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      
      // Check for authentication errors
      if (error instanceof Error && isUnauthorizedError(error)) {
        toast({
          title: "Session Expired",
          description: "Logging you back in...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Connection Error",
        description: "Unable to reach Rapha Lumina. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    const newVoiceEnabled = !voiceEnabled;
    setVoiceEnabled(newVoiceEnabled);
    
    if (!newVoiceEnabled && isSpeaking) {
      // Turning voice OFF - stop any playing audio
      stop();
    } else if (newVoiceEnabled && messages.length > 0) {
      // Turning voice ON - speak the most recent assistant message
      const lastAssistantMessage = messages
        .slice()
        .reverse()
        .find((msg) => msg.role === "assistant");
      
      if (lastAssistantMessage?.content) {
        speak(lastAssistantMessage.content);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader />
      
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {messages.length === 0 ? (
            <WelcomeMessage />
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && <LoadingIndicator />}
            </>
          )}
        </div>
      </ScrollArea>

      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
        voiceEnabled={voiceEnabled}
        onVoiceToggle={handleVoiceToggle}
      />
    </div>
  );
}
