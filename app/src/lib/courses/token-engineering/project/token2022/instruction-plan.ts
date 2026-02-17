import {
  ASSOCIATED_TOKEN_PROGRAM_ID_LABEL,
  LAUNCH_PACK_PROGRAM_ID_LABEL,
  TOKEN_2022_PROGRAM_ID_LABEL,
} from "../constants";
import type { InstructionPlanItem, TokenConfig } from "../types";
import { encodePlanData } from "./encoding";

export function buildInitPlan(config: TokenConfig, mint: string): InstructionPlanItem[] {
  const plan: InstructionPlanItem[] = [
    {
      label: "create-mint-account",
      programId: LAUNCH_PACK_PROGRAM_ID_LABEL,
      keys: [
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: config.mintAuthority, isSigner: true, isWritable: false },
      ],
      dataBase64: encodePlanData("create-mint-account", {
        mint,
        mintAuthority: config.mintAuthority,
      }),
    },
    {
      label: `init-mint-decimals-${config.decimals}`,
      programId: TOKEN_2022_PROGRAM_ID_LABEL,
      keys: [
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: config.mintAuthority, isSigner: true, isWritable: false },
      ],
      dataBase64: encodePlanData("init-mint", {
        decimals: config.decimals,
        mintAuthority: config.mintAuthority,
        freezeAuthority: config.freezeAuthority ?? "",
      }),
    },
  ];

  if (config.extensions.metadataPointer) {
    plan.push({
      label: "extension-metadata-pointer",
      programId: TOKEN_2022_PROGRAM_ID_LABEL,
      keys: [
        { pubkey: mint, isSigner: false, isWritable: true },
        {
          pubkey: config.extensions.metadataPointer.authority,
          isSigner: true,
          isWritable: false,
        },
      ],
      dataBase64: encodePlanData("extension-metadata-pointer", {
        authority: config.extensions.metadataPointer.authority,
        metadataAddress: config.extensions.metadataPointer.metadataAddress,
      }),
    });
  }

  if (config.extensions.transferFee) {
    plan.push({
      label: "extension-transfer-fee",
      programId: TOKEN_2022_PROGRAM_ID_LABEL,
      keys: [
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: config.extensions.transferFee.authority, isSigner: true, isWritable: false },
      ],
      dataBase64: encodePlanData("extension-transfer-fee", {
        authority: config.extensions.transferFee.authority,
        feeBps: config.extensions.transferFee.feeBps,
        maxFee: config.extensions.transferFee.maxFee,
      }),
    });
  }

  if (config.extensions.defaultAccountState) {
    plan.push({
      label: "extension-default-account-state",
      programId: TOKEN_2022_PROGRAM_ID_LABEL,
      keys: [{ pubkey: mint, isSigner: false, isWritable: true }],
      dataBase64: encodePlanData("extension-default-account-state", {
        state: config.extensions.defaultAccountState.state,
      }),
    });
  }

  if (config.extensions.permanentDelegate) {
    plan.push({
      label: "extension-permanent-delegate",
      programId: TOKEN_2022_PROGRAM_ID_LABEL,
      keys: [
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: config.extensions.permanentDelegate.delegate, isSigner: false, isWritable: false },
      ],
      dataBase64: encodePlanData("extension-permanent-delegate", {
        delegate: config.extensions.permanentDelegate.delegate,
      }),
    });
  }

  return plan;
}

export function buildAtaAndMintToDistributionPlan(input: {
  mint: string;
  mintAuthority: string;
  ataDerivations: Array<{ owner: string; ata: string }>;
  recipients: Array<{ owner: string; amount: string }>;
}): InstructionPlanItem[] {
  const recipientAmountByOwner = new Map<string, string>();
  for (const recipient of input.recipients) {
    recipientAmountByOwner.set(recipient.owner, recipient.amount);
  }

  const distributionPlan: InstructionPlanItem[] = [];
  for (const entry of input.ataDerivations) {
    const amount = recipientAmountByOwner.get(entry.owner);
    if (!amount) {
      continue;
    }

    distributionPlan.push({
      label: `create-ata:${entry.owner}`,
      programId: ASSOCIATED_TOKEN_PROGRAM_ID_LABEL,
      keys: [
        { pubkey: input.mint, isSigner: false, isWritable: false },
        { pubkey: entry.owner, isSigner: false, isWritable: false },
        { pubkey: entry.ata, isSigner: false, isWritable: true },
      ],
      dataBase64: encodePlanData("create-ata", {
        owner: entry.owner,
        ata: entry.ata,
      }),
    });

    distributionPlan.push({
      label: `mint-to:${entry.owner}`,
      programId: TOKEN_2022_PROGRAM_ID_LABEL,
      keys: [
        { pubkey: input.mint, isSigner: false, isWritable: true },
        { pubkey: entry.ata, isSigner: false, isWritable: true },
        { pubkey: input.mintAuthority, isSigner: true, isWritable: false },
      ],
      dataBase64: encodePlanData("mint-to", {
        owner: entry.owner,
        amount,
      }),
    });
  }

  return distributionPlan;
}
