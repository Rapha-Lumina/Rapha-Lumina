import { Clover } from "lucide-react";

interface ReflectionPromptProps {
  content: string;
}

export function ReflectionPrompt({ content }: ReflectionPromptProps) {
  return (
    <div
      className="bg-accent/30 border-l-4 border-chart-3 rounded-lg p-6 my-6"
      data-testid="reflection-prompt"
    >
      <div className="flex items-start gap-3">
        <Clover className="h-5 w-5 text-chart-3 mt-1 flex-shrink-0" />
        <p className="text-accent-foreground font-wisdom italic leading-relaxed text-lg">
          {content}
        </p>
      </div>
    </div>
  );
}
