import { ChatMessage } from "../ChatMessage";

export default function ChatMessageExample() {
  const userMessage = {
    id: "1",
    sessionId: "example-session",
    role: "user" as const,
    content: "I'm struggling with finding my purpose. How do I discover what I'm meant to do?",
    timestamp: new Date(),
  };

  const assistantMessage = {
    id: "2",
    sessionId: "example-session",
    role: "assistant" as const,
    content: "Your question touches the very essence of human existence. Before I offer wisdom from across the ages, tell me - when do you feel most alive? What activities make you lose track of time? The Stoics remind us that purpose often reveals itself not in grand visions, but in the quiet moments where our true nature emerges.",
    timestamp: new Date(),
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <ChatMessage message={userMessage} />
        <ChatMessage message={assistantMessage} />
      </div>
    </div>
  );
}
