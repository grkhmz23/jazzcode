import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AccountExplorerSample } from "@/types/content";

interface AccountExplorerProps {
  title: string;
  samples: AccountExplorerSample[];
}

function lamportsToSol(lamports: number): string {
  return (lamports / 1_000_000_000).toFixed(6);
}

export function AccountExplorer({ title, samples }: AccountExplorerProps) {
  return (
    <Card className="mt-8 border-border/60 bg-card/60">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-2 py-2">Label</th>
                <th className="px-2 py-2">Address</th>
                <th className="px-2 py-2">Owner</th>
                <th className="px-2 py-2">Lamports</th>
                <th className="px-2 py-2">Executable</th>
                <th className="px-2 py-2">Data Length</th>
              </tr>
            </thead>
            <tbody>
              {samples.map((sample) => (
                <tr key={sample.address} className="border-b align-top">
                  <td className="px-2 py-2 font-medium">{sample.label}</td>
                  <td className="px-2 py-2 font-mono text-xs">{sample.address}</td>
                  <td className="px-2 py-2 font-mono text-xs">{sample.owner}</td>
                  <td className="px-2 py-2">{sample.lamports} ({lamportsToSol(sample.lamports)} SOL)</td>
                  <td className="px-2 py-2">{sample.executable ? "true" : "false"}</td>
                  <td className="px-2 py-2">{sample.dataLen} bytes</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
          <p>
            <strong>Owner:</strong> Only the owner program can mutate account data.
          </p>
          <p>
            <strong>Executable:</strong> `true` means this account stores program bytecode rather than mutable app state.
          </p>
          <p>
            <strong>Data length:</strong> Rent-exemption requirements scale with bytes stored.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
