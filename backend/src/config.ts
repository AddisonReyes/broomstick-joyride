import dotenv from "dotenv";

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || "prod",
  port: Number(process.env.PORT || "3000"),
  mongoUrl: process.env.MONGO_URL,
  allowedOrigins: parseAllowedOrigins(process.env.ALLOWED_ORIGINS),
};

function parseAllowedOrigins(value?: string): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
