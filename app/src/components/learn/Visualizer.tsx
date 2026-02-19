"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { PublicKey } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLearnRuntime } from "@/components/learn/runtime-context";

type TxInstruction = {
  program: string;
  accounts: string[];
  data: string;
};

function PDAViz() {
  const t = useTranslations("lesson");
  const [programId, setProgramId] = useState("11111111111111111111111111111111");
  const [seedInput, setSeedInput] = useState("vault,user");

  const result = useMemo(() => {
    try {
      const seeds = seedInput
        .split(",")
        .map((seed) => seed.trim())
        .filter(Boolean)
        .map((seed) => Buffer.from(seed));

      const [pda, bump] = PublicKey.findProgramAddressSync(
        seeds,
        new PublicKey(programId)
      );

      return { pda: pda.toBase58(), bump, error: "" };
    } catch (error) {
      return { pda: "", bump: -1, error: error instanceof Error ? error.message : t("invalidInput") };
    }
  }, [programId, seedInput, t]);

  return (
    <div className="space-y-2">
      <Input value={programId} onChange={(event) => setProgramId(event.target.value)} placeholder={t("programIdPlaceholder")} />
      <Input value={seedInput} onChange={(event) => setSeedInput(event.target.value)} placeholder={t("commaSeparatedSeedsPlaceholder")} />
      {result.error ? (
        <p className="text-xs text-red-600">{result.error}</p>
      ) : (
        <div className="rounded border bg-background p-2 text-xs">
          <p>PDA: {result.pda}</p>
          <p>Bump: {result.bump}</p>
        </div>
      )}
    </div>
  );
}

function TxBuilder() {
  const t = useTranslations("lesson");
  const [program, setProgram] = useState("SystemProgram");
  const [accounts, setAccounts] = useState("from,to");
  const [data, setData] = useState("transfer:1000000");
  const [instructions, setInstructions] = useState<TxInstruction[]>([]);

  const totalAccounts = useMemo(
    () => instructions.reduce((sum, instruction) => sum + instruction.accounts.length, 0),
    [instructions]
  );

  return (
    <div className="space-y-2">
      <Input value={program} onChange={(event) => setProgram(event.target.value)} placeholder={t("programPlaceholder")} />
      <Input value={accounts} onChange={(event) => setAccounts(event.target.value)} placeholder={t("accountsCommaSeparatedPlaceholder")} />
      <Input value={data} onChange={(event) => setData(event.target.value)} placeholder="data" />
      <Button
        type="button"
        size="sm"
        onClick={() => {
          setInstructions((prev) => [
            ...prev,
            {
              program,
              accounts: accounts.split(",").map((item) => item.trim()).filter(Boolean),
              data,
            },
          ]);
        }}
      >
        {t("addInstruction")}
      </Button>
      <div className="rounded border bg-background p-2 text-xs">
        <p>Instructions: {instructions.length}</p>
        <p>{t("totalAccountsReferenced", { count: totalAccounts })}</p>
      </div>
    </div>
  );
}

function AccountExplorer() {
  const t = useTranslations("lesson");
  const { terminalState } = useLearnRuntime();
  const [address, setAddress] = useState("");

  const lamports = terminalState.balances[address] ?? BigInt(0);
  const tokenAccounts = Object.values(terminalState.tokenAccounts).filter(
    (account) => account.owner === address
  );

  return (
    <div className="space-y-2">
      <Input value={address} onChange={(event) => setAddress(event.target.value)} placeholder={t("walletAddressPlaceholder")} />
      <div className="rounded border bg-background p-2 text-xs">
        <p>Lamports: {lamports.toString()}</p>
        <p>{t("tokenAccountsCount", { count: tokenAccounts.length })}</p>
      </div>
    </div>
  );
}

export function Visualizer({ type }: { type: "account" | "pda" | "tx" }) {
  return (
    <div className="my-4 rounded-lg border bg-muted/30 p-4">
      <h3 className="mb-2 text-sm font-semibold">Visualizer</h3>
      {type === "pda" ? <PDAViz /> : null}
      {type === "tx" ? <TxBuilder /> : null}
      {type === "account" ? <AccountExplorer /> : null}
    </div>
  );
}
