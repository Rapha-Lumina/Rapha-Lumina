import { ChatHeader } from "../ChatHeader";
import { ThemeProvider } from "../ThemeProvider";

export default function ChatHeaderExample() {
  return (
    <ThemeProvider>
      <div className="bg-background min-h-screen">
        <ChatHeader onMenuClick={() => console.log("Menu clicked")} />
      </div>
    </ThemeProvider>
  );
}
