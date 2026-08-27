import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

/**
 * Turns any thrown error into a short, plain-English reason an admin can act on
 * (never a raw stack trace or Prisma code), plus a sensible HTTP status.
 *
 * @param context  what was being saved, e.g. "product", "offer", "hero image"
 * @param fieldLabels  maps a schema field to a friendlier word for
 *                     "already exists" messages, e.g. { slug: "web address" }
 */
export function explainError(
  error: unknown,
  context = "item",
  fieldLabels: Record<string, string> = {}
): { message: string; status: number } {
  const rawMessage = error instanceof Error ? error.message : "";

  // Foreign-key violations don't always arrive as a mapped P2003 code (a plain
  // Postgres RESTRICT error can surface as an "unknown" Prisma error), so match
  // on the message too — and tell the two directions apart.
  if (/is referenced from table|violates restrict setting|still referenced/i.test(rawMessage)) {
    return {
      message: `This ${context} is still linked to other records (such as reviews or orders), so it can't be deleted. To hide it from the store, set it to Inactive instead.`,
      status: 409,
    };
  }
  if (/foreign key constraint|is not present in table|violates foreign key/i.test(rawMessage)) {
    return {
      message: `A value you selected for this ${context} (such as the category) no longer exists. Refresh the page and choose it again.`,
      status: 400,
    };
  }

  // Known, structured database errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        const target = error.meta?.target as string[] | string | undefined;
        const fields = Array.isArray(target) ? target : target ? [target] : [];
        const label = fields.map((f) => fieldLabels[f] || f).join(" and ") || "value";
        return {
          message: `Another ${context} already uses that ${label}. You can't add the same ${context} twice — change it and try again.`,
          status: 409,
        };
      }
      case "P2003":
        return {
          message: `Can't save this ${context} — either a value you picked (like the category) no longer exists, or this ${context} is still linked to other records such as reviews or orders. Refresh the page and try again; to simply hide a ${context}, set it to Inactive instead.`,
          status: 409,
        };
      case "P2025":
        return {
          message: `That ${context} could not be found — it may have already been deleted. Refresh the page.`,
          status: 404,
        };
      case "P2000":
        return {
          message: `One of the values is too long to save. Shorten it and try again.`,
          status: 400,
        };
      case "P2011":
      case "P2012":
        return {
          message: `A required field is missing. Fill in every field marked with * and try again.`,
          status: 400,
        };
      default:
        return {
          message: `The database refused to save this ${context}. Check the fields and try again.`,
          status: 400,
        };
    }
  }

  // Database unreachable / cold serverless connection / transaction start timeout
  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    /transaction|timed out|can'?t reach database|connection pool|ECONNRESET|ETIMEDOUT/i.test(rawMessage)
  ) {
    return {
      message: `Couldn't reach the database just now. Wait a few seconds and try again.`,
      status: 503,
    };
  }

  // Bad shape of data sent to Prisma
  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      message: `Some of the submitted data is in the wrong format. Check the fields and try again.`,
      status: 400,
    };
  }

  // Any other Prisma-level error we didn't specifically map
  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      message: `The database refused this change to the ${context}. Check the values and try again.`,
      status: 400,
    };
  }

  // Body wasn't valid JSON / form data
  if (error instanceof SyntaxError) {
    return {
      message: `The submitted data couldn't be read. Refresh the page and try again.`,
      status: 400,
    };
  }

  return {
    message: `Something went wrong while saving this ${context}. Please try again — if it keeps happening, contact support.`,
    status: 500,
  };
}

/**
 * Logs the real error server-side (for debugging) and returns a JSON response
 * whose `error` field is safe and useful to show an admin directly.
 */
export function errorResponse(
  error: unknown,
  context = "item",
  fieldLabels: Record<string, string> = {}
): NextResponse {
  console.error(`[admin:${context}]`, error);
  const { message, status } = explainError(error, context, fieldLabels);
  return NextResponse.json({ error: message }, { status });
}
