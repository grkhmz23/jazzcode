export const ERR_NOT_SIGNER = "ERR_NOT_SIGNER" as const;
export const ERR_BAD_OWNER = "ERR_BAD_OWNER" as const;
export const ERR_BAD_PDA = "ERR_BAD_PDA" as const;
export const ERR_BAD_AMOUNT = "ERR_BAD_AMOUNT" as const;
export const ERR_OVERFLOW = "ERR_OVERFLOW" as const;
export const ERR_UNDERFLOW = "ERR_UNDERFLOW" as const;
export const ERR_ACCOUNT_NOT_FOUND = "ERR_ACCOUNT_NOT_FOUND" as const;

export type RuntimeErrorCode =
  | typeof ERR_NOT_SIGNER
  | typeof ERR_BAD_OWNER
  | typeof ERR_BAD_PDA
  | typeof ERR_BAD_AMOUNT
  | typeof ERR_OVERFLOW
  | typeof ERR_UNDERFLOW
  | typeof ERR_ACCOUNT_NOT_FOUND;
