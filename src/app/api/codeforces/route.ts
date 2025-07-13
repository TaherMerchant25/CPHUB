import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    status: 200,
    supportedRoutes: [
      {
        route: "/api/codeforces/user/[username]",
        description: "Fetches user data for a specific Codeforces user.",
      },
      {
        route: "/api/codeforces/problems",
        description: "Fetches all Codeforces problems from the problemset.",
      },
      {
        route: "/api/codeforces/problems/[contestId]?index=[index]",
        description:
          "Fetches a specific problem from a contest by contest ID and problem index.",
        filters: [
          {
            name: "index",
            description:
              "The problem index within the contest (e.g., A, B, C, D, etc.).",
            example: "index=A",
          },
        ],
      },
      {
        route: "/api/codeforces/contest",
        description: "Fetches all contests from Codeforces.",
      },
      {
        route: "/api/codeforces/contest/upcoming",
        description: "Fetches upcoming contests from Codeforces.",
      },
      {
        route: "/api/codeforces/user/[username]/calendar",
        description:
          "Fetches the user submission history for a specific Codeforces user.",
      },
    ],
  });
}
