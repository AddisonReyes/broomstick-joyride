import dotenv from "dotenv";

dotenv.config();

const rawAllowedOrigins = [
  process.env.ALLOWED_ORIGINS,
  process.env.ALLOWED_CORS,
]
  .filter(Boolean)
  .join(",");

export const config = {
  env: process.env.NODE_ENV || "prod",
  port: Number(process.env.PORT || "3000"),
  mongoUrl: process.env.MONGO_URL,
  allowedOrigins: parseAllowedOrigins(rawAllowedOrigins),
};

function parseAllowedOrigins(value?: string): string[] {
  if (!value) {
    return [];
  }

  const normalizedOrigins = new Set<string>();

  for (const origin of value.split(",")) {
    const normalizedOrigin = normalizeAllowedOrigin(origin);

    if (normalizedOrigin) {
      normalizedOrigins.add(normalizedOrigin);
    }
  }

  return Array.from(normalizedOrigins);
}

function normalizeAllowedOrigin(value: string): string | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const candidate = ensureProtocol(trimmedValue);

  if (candidate.includes("*")) {
    return normalizeWildcardOrigin(candidate);
  }

  try {
    return new URL(candidate).origin;
  } catch {
    return null;
  }
}

function normalizeWildcardOrigin(value: string): string | null {
  const wildcardMatch = value.match(/^(https?):\/\/\*\.(.+)$/i);

  if (!wildcardMatch) {
    return null;
  }

  const protocol = wildcardMatch[1];
  const hostWithPath = wildcardMatch[2];

  if (!protocol || !hostWithPath) {
    return null;
  }

  const [host] = hostWithPath.split(/[/?#]/);

  if (!host) {
    return null;
  }

  return `${protocol}://*.${host}`;
}

function ensureProtocol(value: string): string {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://${value}`;
}
