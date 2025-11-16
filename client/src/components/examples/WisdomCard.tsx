import { WisdomCard } from "../WisdomCard";
import { Compass, Leaf, Star } from "lucide-react";

export default function WisdomCardExample() {
  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-2xl mx-auto space-y-4">
        <WisdomCard
          tradition="Stoic Philosophy"
          icon={Compass}
          content="Marcus Aurelius teaches us that our purpose is not bestowed from without, but discovered within. 'What we do now echoes in eternity' - begin by examining what virtues you wish to embody."
          accentColor="border-chart-2"
        />
        <WisdomCard
          tradition="Eastern Wisdom"
          icon={Leaf}
          content="The Tao reminds us that the river does not force its way to the ocean - it follows the path of least resistance. Your purpose, too, may be found in flowing with your natural inclinations rather than against them."
          accentColor="border-chart-4"
        />
        <WisdomCard
          tradition="Mystical Traditions"
          icon={Star}
          content="As the Sufis say, 'The wound is where the light enters you.' Often, our deepest struggles point toward our greatest purpose. What pain in the world moves you most deeply?"
          accentColor="border-primary"
        />
      </div>
    </div>
  );
}
