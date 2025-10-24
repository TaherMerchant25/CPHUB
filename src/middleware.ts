import { NextResponse, NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;
try {
  // Initialize Upstash Redis rate limiter if env vars are present
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "1 m"),
    });
  }
} catch {
  ratelimit = null;
}

export async function middleware(req: NextRequest) {
  // If rate limiter is not configured, bypass in local/dev environments
  if (!ratelimit) {
    return NextResponse.next();
  }

  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0] || "";

  const { success } = await ratelimit.limit(ip);

  if (success) {
    return NextResponse.next();
  }

  return new NextResponse(
    JSON.stringify({
      status: 429,
      message: "Too many requests, please try again later.",
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export const config = {
  matcher: ["/api/leetcode/:path*", "/api/codechef/:path*"],
};
