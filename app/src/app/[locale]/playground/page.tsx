import { PlaygroundShell } from "@/components/playground/PlaygroundShell";
import { GlassCard } from "@/components/luxury/primitives";

export default function PlaygroundPage() {
  return (
    <section className="academy-pop-in container py-6">
      <GlassCard className="overflow-hidden border-white/10 bg-[#0B0E18]/85" glowColor="indigo">
        <PlaygroundShell />
      </GlassCard>
    </section>
  );
}
