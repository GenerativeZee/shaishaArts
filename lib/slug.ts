import { prisma } from "@/lib/prisma";

/** Normalise any string into a URL-safe product slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns `desired` (slugified) if no other product uses it, otherwise the first
 * free `desired-2`, `desired-3`, … — the same behaviour as WordPress/Shopify.
 * Pass `exceptId` when updating so a product doesn't collide with itself.
 */
export async function uniqueProductSlug(desired: string, exceptId?: string): Promise<string> {
  const base = slugify(desired) || "product";

  const existing = await prisma.product.findMany({
    where: {
      slug: { startsWith: base },
      ...(exceptId ? { id: { not: exceptId } } : {}),
    },
    select: { slug: true },
  });
  const taken = new Set(existing.map((p) => p.slug));

  if (!taken.has(base)) return base;

  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
