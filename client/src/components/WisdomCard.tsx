import { LucideIcon } from "lucide-react";

interface WisdomCardProps {
  tradition: string;
  icon: LucideIcon;
  content: string;
  accentColor?: string;
}

export function WisdomCard({
  tradition,
  icon: Icon,
  content,
  accentColor = "border-primary",
}: WisdomCardProps) {
  return (
    <div
      className={`bg-card border border-card-border rounded-xl p-6 border-l-4 ${accentColor}`}
      data-testid={`wisdom-card-${tradition.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">
          {tradition}
        </span>
      </div>
      <p className="text-card-foreground leading-relaxed">{content}</p>
    </div>
  );
}
