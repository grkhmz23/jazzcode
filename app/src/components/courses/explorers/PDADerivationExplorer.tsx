import { PublicKey } from "@solana/web3.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PDADerivationExplorerProps {
  title: string;
  programId: string;
  seeds: string[];
}

function toSeedBytes(seed: string): Uint8Array {
  return new TextEncoder().encode(seed);
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(" ");
}

export function PDADerivationExplorer({ title, programId, seeds }: PDADerivationExplorerProps) {
  const seedBytes = seeds.map((seed) => toSeedBytes(seed));
  const [pda, bump] = PublicKey.findProgramAddressSync(seedBytes, new PublicKey(programId));

  return (
    <Card className="mt-8 border-border/60 bg-card/60">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Program ID</p>
          <p className="font-mono text-xs">{programId}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Derived PDA</p>
          <p className="font-mono text-xs">{pda.toBase58()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Bump</p>
          <p className="font-mono text-xs">{bump}</p>
        </div>
        <div>
          <p className="mb-2 text-xs text-muted-foreground">Seed bytes (UTF-8)</p>
          <ul className="space-y-1">
            {seeds.map((seed, index) => (
              <li key={`${seed}-${index}`} className="rounded-md border bg-background p-2 text-xs">
                <p>
                  <span className="font-medium">Seed {index + 1}:</span> <code>{seed}</code>
                </p>
                <p className="font-mono text-[11px] text-muted-foreground">[{toHex(seedBytes[index])}]</p>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
