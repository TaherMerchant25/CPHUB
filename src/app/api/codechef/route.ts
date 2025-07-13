import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: 200,
    supportedRoutes: [
      {
        route: "/api/codechef/user/[username]",
        description: "Fetches user data for a specific CodeChef user.",
      },
      {
        route: "/api/codechef/problems",
        description: "Fetches recent CodeChef problems with optional filters.",
        filters: [
          {
            name: "limit",
            description: "Number of problems to fetch. Default is 20, max is 100.",
            example: "limit=50",
          },
        ],
      },
      {
        route: "/api/codechef/problems/potd",
        description: "Fetches the Problem of the Day from CodeChef.",
      },
      {
        route: "/api/codechef/contest/upcoming",
        description: "Fetches upcoming contests from CodeChef.",
      },
    ],
  });
}
