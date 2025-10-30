import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { ChatMessage, type Message } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSpeechSynthesis } from "@/hooks/useVoice";
import { useAuth } from "@/hooks/useAuth";
import { Trash2 } from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { speak, stop, isSpeaking } = useSpeechSynthesis();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Load messages on mount - from server if authenticated, localStorage if not
  useEffect(() => {
    if (authLoading) return;

    async function loadMessages() {
      if (isAuthenticated) {
        // Load from server for authenticated users
        try {
          const response = await fetch('/api/messages');
          if (response.ok) {
            const serverMessages = await response.json();
            setMessages(serverMessages);
          } else {
            console.error("Failed to load messages from server");
          }
        } catch (error) {
          console.error("Error loading messages from server:", error);
        }
      } else {
        // Load from localStorage for non-authenticated users
        const savedMessages = localStorage.getItem('chatMessages');
        if (savedMessages) {
          try {
            setMessages(JSON.parse(savedMessages));
          } catch (error) {
            console.error("Failed to load saved messages:", error);
          }
        }
      }
    }

    loadMessages();
  }, [isAuthenticated, authLoading]);

  // Save messages to localStorage only for non-authenticated users
  useEffect(() => {
    if (!authLoading && !isAuthenticated && messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages, isAuthenticated, authLoading]);

  // Stop speech on component unmount
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        stop();
      }
    };
  }, [isSpeaking, stop]);

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

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sessionId: "local",
      role: "user",
      content,
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Prepare request body
      const requestBody: any = { content };
      
      // For non-authenticated users, send conversation history
      if (!isAuthenticated) {
        requestBody.history = messages;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json() as {
          userMessage: Message;
          assistantMessage: Message;
        };

        // Replace temp message with server response
        setMessages((prev) => {
          const withoutTemp = prev.filter(msg => msg.id !== userMessage.id);
          return [...withoutTemp, data.userMessage, data.assistantMessage];
        });
        
        // Speak the assistant's response if voice is enabled
        if (voiceEnabled && data.assistantMessage.content) {
          speak(data.assistantMessage.content);
        }
      } else {
        throw new Error("Failed to get response");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      
      toast({
        title: "Connection Error",
        description: "Unable to reach Rapha Lumina. Please try again.",
        variant: "destructive",
      });
      
      // Remove the user message if request failed
      setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    const newVoiceEnabled = !voiceEnabled;
    setVoiceEnabled(newVoiceEnabled);
    
    if (!newVoiceEnabled && isSpeaking) {
      stop();
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear all messages? This cannot be undone.")) {
      setMessages([]);
      localStorage.removeItem('chatMessages');
      if (isSpeaking) {
        stop();
      }
      toast({
        title: "Conversation cleared",
        description: "Your chat history has been deleted.",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl text-foreground">Conversation with Rapha Lumina</h1>
              <p className="text-sm text-muted-foreground">Explore wisdom and discover your inner truth</p>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearChat}
                  title="Clear conversation"
                  data-testid="button-clear-chat"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1">
          <div className="max-w-5xl mx-auto px-4 py-6">
            {messages.length === 0 ? (
              <WelcomeMessage />
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
            )}
            {isLoading && <LoadingIndicator />}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading}
              voiceEnabled={voiceEnabled}
              onVoiceToggle={handleVoiceToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
