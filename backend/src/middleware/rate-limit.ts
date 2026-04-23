import { NextFunction, Request, Response } from "express";
import { MAX_REQUESTS_PER_WINDOW, REQUEST_WINDOW_MS } from "../constants.js";

const requestLog = new Map<string, number[]>();

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const clientKey = getClientKey(req);
  const now = Date.now();
  const recentRequests = getRecentRequests(clientKey, now);

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    res.status(429).json({
      message: "Too many requests. Please try again later.",
    });
    return;
  }

  recentRequests.push(now);
  requestLog.set(clientKey, recentRequests);

  next();
}

function getRecentRequests(clientKey: string, now: number): number[] {
  const requestTimes = requestLog.get(clientKey) || [];

  return requestTimes.filter(
    (timestamp) => now - timestamp < REQUEST_WINDOW_MS,
  );
}

function getClientKey(req: Request): string {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    const firstForwardedIp = forwardedFor.split(",")[0]?.trim();

    if (firstForwardedIp) {
      return firstForwardedIp;
    }
  }

  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    const firstForwardedIp = forwardedFor[0];

    if (firstForwardedIp) {
      return firstForwardedIp;
    }
  }

  return req.ip || "unknown";
}
