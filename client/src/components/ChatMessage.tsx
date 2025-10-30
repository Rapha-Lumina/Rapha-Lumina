import { Sparkles } from "lucide-react";

export type Message = {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date | string;
};

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const timestamp = typeof message.timestamp === 'string' 
    ? new Date(message.timestamp) 
    : message.timestamp;

  return (
    <div
      className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"}`}
      data-testid={`message-${message.role}-${message.id}`}
    >
      <div
        className={`max-w-[85%] md:max-w-[75%] ${
          isUser
            ? "bg-primary/90 text-primary-foreground rounded-2xl p-6 shadow-lg"
            : "bg-card border border-card-border rounded-2xl p-6"
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-display font-medium text-muted-foreground">
              Rapha Lumina
            </span>
          </div>
        )}
        <div
          className={`${
            isUser
              ? "text-primary-foreground"
              : "text-card-foreground"
          } leading-relaxed whitespace-pre-wrap`}
        >
          {message.content}
        </div>
        <div
          className={`text-xs mt-3 ${
            isUser
              ? "text-primary-foreground/60"
              : "text-muted-foreground"
          }`}
        >
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
