import { ChatInput } from "../ChatInput";

export default function ChatInputExample() {
  return (
    <div className="bg-background min-h-screen flex items-end">
      <div className="w-full">
        <ChatInput
          onSendMessage={(msg) => console.log("Message sent:", msg)}
          isLoading={false}
        />
      </div>
    </div>
  );
}
