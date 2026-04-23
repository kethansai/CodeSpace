import type { AnimationStep } from "@/data/types";

// ────────────────────────────────────────────────────────────────────────
// Bit manipulation visualizer data model
// ────────────────────────────────────────────────────────────────────────
// auxiliaryData.bit = {
//   title: string,
//   width: number,                       // total bits rendered
//   rows: BitRow[],                      // one or more bit rows (e.g. x and x-1)
//   highlight?: number[],                // bit indices (0 = LSB) highlighted
//   changed?: number[],                  // bit indices that flipped this step
// }
// BitRow = { label: string, value: number, bits: (0|1)[] }
// `bits[0]` is LSB, `bits[width-1]` is MSB — left-to-right display should reverse.

export interface BitRow {
  label: string;
  value: number;
  bits: (0 | 1)[];
}

function bitsOf(x: number, width: number): (0 | 1)[] {
  const out: (0 | 1)[] = [];
  for (let i = 0; i < width; i++) out.push(((x >> i) & 1) as 0 | 1);
  return out;
}

function snap(
  steps: AnimationStep[],
  title: string,
  width: number,
  rows: BitRow[],
  description: string,
  extras: Partial<{ highlight: number[]; changed: number[]; variables: Record<string, string | number> }> = {},
) {
  steps.push({
    description,
    array: [],
    variables: extras.variables,
    auxiliaryData: {
      bit: {
        title,
        width,
        rows: rows.map((r) => ({ label: r.label, value: r.value, bits: [...r.bits] })),
        highlight: extras.highlight ? [...extras.highlight] : undefined,
        changed: extras.changed ? [...extras.changed] : undefined,
      },
    },
  });
}

// ═════════════════════════════════════════════════════════════
// 1. Bit Basics — show individual operations on n
// ═════════════════════════════════════════════════════════════
export function generateBitBasicsSteps(n = 29): AnimationStep[] {
  const width = 8;
  const steps: AnimationStep[] = [];
  const title = `Bit tricks on n = ${n}`;

  snap(steps, title, width, [{ label: "n", value: n, bits: bitsOf(n, width) }],
    `n = ${n} = 0b${n.toString(2).padStart(width, "0")}`);

  // n & 1 — parity
  snap(steps, title, width,
    [
      { label: "n", value: n, bits: bitsOf(n, width) },
      { label: "1", value: 1, bits: bitsOf(1, width) },
      { label: "n & 1", value: n & 1, bits: bitsOf(n & 1, width) },
    ],
    `n & 1 = ${n & 1} → ${n & 1 ? "odd" : "even"}`,
    { highlight: [0] },
  );

  // Set bit 1
  const afterSet = n | (1 << 1);
  snap(steps, title, width,
    [
      { label: "n", value: n, bits: bitsOf(n, width) },
      { label: "1 << 1", value: 1 << 1, bits: bitsOf(1 << 1, width) },
      { label: "n | (1<<1)", value: afterSet, bits: bitsOf(afterSet, width) },
    ],
    `Set bit 1: n | (1<<1) = ${afterSet}`,
    { highlight: [1], changed: afterSet !== n ? [1] : [] },
  );

  // Clear lowest set bit
  const cleared = n & (n - 1);
  const lowest = Math.log2(n & -n) | 0;
  snap(steps, title, width,
    [
      { label: "n", value: n, bits: bitsOf(n, width) },
      { label: "n - 1", value: n - 1, bits: bitsOf(n - 1, width) },
      { label: "n & (n-1)", value: cleared, bits: bitsOf(cleared, width) },
    ],
    `n & (n-1) clears the lowest set bit (bit ${lowest})`,
    { highlight: [lowest], changed: [lowest] },
  );

  // Isolate lowest bit
  const isolated = n & -n;
  snap(steps, title, width,
    [
      { label: "n", value: n, bits: bitsOf(n, width) },
      { label: "-n", value: (-n) & ((1 << width) - 1), bits: bitsOf(-n, width) },
      { label: "n & -n", value: isolated, bits: bitsOf(isolated, width) },
    ],
    `n & -n isolates the lowest set bit → ${isolated}`,
    { highlight: [lowest] },
  );

  return steps;
}

// ═════════════════════════════════════════════════════════════
// 2. Single Number (XOR across array)
// ═════════════════════════════════════════════════════════════
export function generateSingleNumberSteps(
  input: number[] = [2, 3, 5, 4, 5, 3, 4],
): AnimationStep[] {
  const nums = input.slice(0, 10);
  const maxVal = Math.max(1, ...nums);
  const width = Math.max(4, Math.ceil(Math.log2(maxVal + 1)));
  const steps: AnimationStep[] = [];
  const title = `Single Number — XOR accumulate`;

  let acc = 0;
  snap(steps, title, width,
    [{ label: "acc", value: acc, bits: bitsOf(acc, width) }],
    `Start with acc = 0. Array = [${nums.join(", ")}]`,
    { variables: { acc: 0 } },
  );

  for (const x of nums) {
    const next = acc ^ x;
    const changed: number[] = [];
    for (let i = 0; i < width; i++) if (((acc >> i) & 1) !== ((next >> i) & 1)) changed.push(i);
    snap(steps, title, width,
      [
        { label: "acc", value: acc, bits: bitsOf(acc, width) },
        { label: `x = ${x}`, value: x, bits: bitsOf(x, width) },
        { label: "acc ^ x", value: next, bits: bitsOf(next, width) },
      ],
      `XOR in ${x} → acc = ${next}`,
      { highlight: changed, changed, variables: { acc: next, x } },
    );
    acc = next;
  }

  snap(steps, title, width,
    [{ label: "acc", value: acc, bits: bitsOf(acc, width) }],
    `Result: unique element = ${acc}`,
    { variables: { result: acc } },
  );
  return steps;
}

// ═════════════════════════════════════════════════════════════
// 3. Brian Kernighan's set-bit count
// ═════════════════════════════════════════════════════════════
export function generateCountSetBitsSteps(n = 29): AnimationStep[] {
  const width = Math.max(8, Math.ceil(Math.log2(n + 1)));
  const steps: AnimationStep[] = [];
  const title = `Count set bits of ${n}`;

  let x = n;
  let count = 0;
  snap(steps, title, width,
    [{ label: "x", value: x, bits: bitsOf(x, width) }],
    `Start. x = ${x}, count = 0`,
    { variables: { x, count } },
  );

  while (x > 0) {
    const lowest = Math.log2(x & -x) | 0;
    const next = x & (x - 1);
    snap(steps, title, width,
      [
        { label: "x", value: x, bits: bitsOf(x, width) },
        { label: "x - 1", value: x - 1, bits: bitsOf(x - 1, width) },
        { label: "x & (x-1)", value: next, bits: bitsOf(next, width) },
      ],
      `x & (x-1) clears bit ${lowest}`,
      { highlight: [lowest], changed: [lowest], variables: { x, "x-1": x - 1 } },
    );
    x = next;
    count++;
    snap(steps, title, width,
      [{ label: "x", value: x, bits: bitsOf(x, width) }],
      `count = ${count}, x = ${x}`,
      { variables: { x, count } },
    );
  }

  snap(steps, title, width,
    [{ label: "n", value: n, bits: bitsOf(n, width) }],
    `Done. ${n} has ${count} set bits.`,
    { variables: { result: count } },
  );
  return steps;
}

// ═════════════════════════════════════════════════════════════
// 4. Power of Two detection
// ═════════════════════════════════════════════════════════════
export function generatePowerOfTwoSteps(n = 16): AnimationStep[] {
  const width = Math.max(8, Math.ceil(Math.log2(Math.max(n, 1) + 1)));
  const steps: AnimationStep[] = [];
  const title = `Is ${n} a power of two?`;

  snap(steps, title, width,
    [{ label: "n", value: n, bits: bitsOf(n, width) }],
    `Test: n > 0 && (n & (n-1)) == 0`,
    { variables: { n } },
  );

  if (n <= 0) {
    snap(steps, title, width,
      [{ label: "n", value: n, bits: bitsOf(n, width) }],
      `${n} ≤ 0 → not a power of two.`,
      { variables: { answer: "false" } },
    );
    return steps;
  }

  const andResult = n & (n - 1);
  snap(steps, title, width,
    [
      { label: "n", value: n, bits: bitsOf(n, width) },
      { label: "n - 1", value: n - 1, bits: bitsOf(n - 1, width) },
      { label: "n & (n-1)", value: andResult, bits: bitsOf(andResult, width) },
    ],
    `n & (n-1) = ${andResult}`,
    { highlight: [], variables: { "n&(n-1)": andResult } },
  );

  snap(steps, title, width,
    [{ label: "n", value: n, bits: bitsOf(n, width) }],
    andResult === 0
      ? `${n} is a power of two (single bit set).`
      : `${n} has more than one set bit → not a power of two.`,
    { variables: { answer: andResult === 0 ? "true" : "false" } },
  );
  return steps;
}

// ═════════════════════════════════════════════════════════════
// 5. Reverse Bits — SWAR-style halving
// ═════════════════════════════════════════════════════════════
export function generateReverseBitsSteps(input = 43261596): AnimationStep[] {
  // Keep things readable: reverse just 16 bits if the number fits.
  const width = (input >>> 16) === 0 ? 16 : 32;
  const steps: AnimationStep[] = [];
  const title = `Reverse ${width} bits of ${input}`;

  let n = input >>> 0;
  snap(steps, title, width,
    [{ label: "n", value: n, bits: bitsOf(n, width) }],
    `Start. n = ${n}`,
    { variables: { n } },
  );

  let res = 0;
  for (let i = 0; i < width; i++) {
    const bit = (n >> i) & 1;
    res = ((res << 1) | bit) >>> 0;
    const displayN = n >>> (i + 1);
    snap(steps, title, width,
      [
        { label: "n >> i", value: displayN, bits: bitsOf(displayN, width) },
        { label: "res", value: res, bits: bitsOf(res, width) },
      ],
      `Step ${i + 1}/${width}: plucked bit ${bit} → res = ${res}`,
      { highlight: [width - 1 - i], variables: { step: i + 1, bit, res } },
    );
  }

  snap(steps, title, width,
    [
      { label: "input", value: input, bits: bitsOf(input, width) },
      { label: "reversed", value: res, bits: bitsOf(res, width) },
    ],
    `Done. reversed = ${res}`,
    { variables: { result: res } },
  );
  return steps;
}

// ═════════════════════════════════════════════════════════════
// 6. Bitmask Subset Enumeration
// ═════════════════════════════════════════════════════════════
export function generateBitmaskSubsetsSteps(nBits = 3): AnimationStep[] {
  const width = Math.max(4, nBits);
  const steps: AnimationStep[] = [];
  const title = `Enumerate subsets of {0, …, ${nBits - 1}} via bitmasks`;

  for (let mask = 0; mask < 1 << nBits; mask++) {
    const inSet: number[] = [];
    for (let i = 0; i < nBits; i++) if (mask & (1 << i)) inSet.push(i);
    snap(steps, title, width,
      [{ label: `mask = ${mask}`, value: mask, bits: bitsOf(mask, width) }],
      `mask = ${mask.toString(2).padStart(nBits, "0")} → subset {${inSet.join(", ")}}`,
      { highlight: inSet, variables: { mask, subset: `{${inSet.join(",")}}` } },
    );
  }

  snap(steps, title, width,
    [{ label: "done", value: 0, bits: bitsOf(0, width) }],
    `All 2^${nBits} = ${1 << nBits} subsets enumerated.`,
    { variables: { total: 1 << nBits } },
  );
  return steps;
}
