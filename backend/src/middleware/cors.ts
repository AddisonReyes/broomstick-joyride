import cors, { CorsOptions } from "cors";
import { HTTP_METHODS } from "../constants.js";

export function createCorsMiddleware(allowedOrigins: string[]) {
  return cors(buildCorsOptions(allowedOrigins));
}

function buildCorsOptions(origins: string[]): CorsOptions {
  return {
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (matchesAllowedOrigin(origin, origins)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS."));
    },
    methods: [...HTTP_METHODS],
    allowedHeaders: ["Content-Type"],
    optionsSuccessStatus: 204,
  };
}

function matchesAllowedOrigin(origin: string, allowedOrigins: string[]): boolean {
  return allowedOrigins.some((allowedOrigin) => {
    if (allowedOrigin.includes("*")) {
      return matchesWildcardOrigin(origin, allowedOrigin);
    }

    return origin === allowedOrigin;
  });
}

function matchesWildcardOrigin(origin: string, allowedOrigin: string): boolean {
  const wildcardMatch = allowedOrigin.match(/^(https?):\/\/\*\.(.+)$/i);

  if (!wildcardMatch) {
    return false;
  }

  const [, protocol, host] = wildcardMatch;

  try {
    const originUrl = new URL(origin);

    return (
      originUrl.protocol === `${protocol}:` &&
      originUrl.hostname !== host &&
      originUrl.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}
