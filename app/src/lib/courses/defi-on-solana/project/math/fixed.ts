export function divFloor(numerator: bigint, denominator: bigint, field: string): bigint {
  if (denominator === BigInt(0)) {
    throw new Error(`Division by zero: ${field}`);
  }
  return numerator / denominator;
}

export function mulDivFloor(
  a: bigint,
  b: bigint,
  denominator: bigint,
  field: string,
): bigint {
  return divFloor(a * b, denominator, field);
}
