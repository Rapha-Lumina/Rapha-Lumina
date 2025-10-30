import { ReflectionPrompt } from "../ReflectionPrompt";

export default function ReflectionPromptExample() {
  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-2xl mx-auto">
        <ReflectionPrompt content="Take a moment to sit with this question: What would you do if you knew you could not fail? Let the answer arise naturally, without judgment." />
        <ReflectionPrompt content="Consider this invitation from the universe: Your purpose may already be calling to you through the things that break your heart. What injustice or suffering touches you most deeply?" />
      </div>
    </div>
  );
}
