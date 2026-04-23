import cors, { CorsOptions } from "cors";
import { HTTP_METHODS } from "../constants.js";

export function createCorsMiddleware(allowedOrigins: string[]) {
  return cors(buildCorsOptions(allowedOrigins));
}

function buildCorsOptions(origins: string[]): CorsOptions {
  return {
    origin: (origin, callback) => {
      if (!origin) {
        callback(new Error("Origin header is required."));
        return;
      }

      if (origins.includes(origin)) {
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
