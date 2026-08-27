import { prisma } from "./prisma";

// Unambiguous alphabet — no O/0, I/1, so codes are safe to read out over the
// phone and type on the track-order page.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SUFFIX_LEN = 4;

function randomSuffix(): string {
  let s = "";
  for (let i = 0; i < SUFFIX_LEN; i++) {
    s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return s;
}

/** Highest sequential number currently in use, ignoring any random suffix. */
async function nextSequence(): Promise<number> {
  const orders = await prisma.order.findMany({ select: { code: true } });
  let max = 1000;
  for (const { code } of orders) {
    const m = /^SA(\d+)/.exec(code);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return max + 1;
}

/**
 * Order codes look like `SA1042-K7QX`: a readable sequential number plus a
 * random suffix so the code can't be guessed from a nearby order.
 */
export async function generateOrderCode(): Promise<string> {
  const seq = await nextSequence();
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = `SA${seq}-${randomSuffix()}`;
    const clash = await prisma.order.findUnique({ where: { code }, select: { code: true } });
    if (!clash) return code;
  }
  // Extremely unlikely; fall back to a longer suffix.
  return `SA${seq}-${randomSuffix()}${randomSuffix()}`;
}
