import { MAX_REQUESTS_PER_WINDOW, REQUEST_WINDOW_MS } from "../constants.js";
const requestLog = new Map();
export function rateLimit(req, res, next) {
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
function getRecentRequests(clientKey, now) {
    const requestTimes = requestLog.get(clientKey) || [];
    return requestTimes.filter((timestamp) => now - timestamp < REQUEST_WINDOW_MS);
}
function getClientKey(req) {
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
//# sourceMappingURL=rate-limit.js.map