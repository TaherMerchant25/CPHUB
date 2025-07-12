import { NextResponse, NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});
export async function middleware(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0] || "";
  const { success } = await ratelimit.limit(ip);
  if (success) {
    return NextResponse.next();
  }
  return NextResponse.json({
    status: 429,
    message: "Too many requests, please try again later.",
  });
}
export const config = {
  matcher: ["/api/leetcode/:path*", "/api/codechef/:path*"],
};
