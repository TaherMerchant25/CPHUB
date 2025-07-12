import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    status: 200,
    supportedRoutes: [
      {
        route: "/api/leetcode/user/[username]",
        description: "Fetches user data for a specific LeetCode user.",
      },
      {
        route: "/api/leetcode/problems",
        description:
          "Fetches all LeetCode problems with optional filters like difficulty, tags, category, and question ID.",
        filters: [
          {
            name: "difficulty",
            description:
              "Filter problems by difficulty level (Easy, Medium, Hard).",
            example: "difficulty=Easy",
          },
          {
            name: "tags",
            description:
              "Filter problems by one or more topic tags (e.g., array, dynamic-programming, graph). Multiple tags can be specified like `tags=dp&tags=array`.",
            example: "tags=array&tags=dynamic-programming",
          },
          {
            name: "category",
            description:
              "Filter problems by LeetCode category slug (e.g., 'algorithms', 'database', etc.).",
            example: "category=algorithms",
          },
          {
            name: "frontendQuestionId",
            description:
              "Search for a problem by its frontend question ID (e.g., 1, 242) or title slug (e.g., 'two-sum'). Case insensitive.",
            example: "frontendQuestionId=two-sum",
          },
          {
            name: "skip",
            description:
              "Number of questions to skip for pagination. Default is 0.",
            example: "skip=100",
          },
        ],
      },
      {
        route: "/api/leetcode/problems/potd",
        description: "Fetches the Question of the Day from LeetCode.",
      },
      {
        route: "/api/leetcode/user/[username]/calendar",
        description:
          "Fetches the user calendar data for a specific LeetCode user.",
      },
      {
        route: "/api/leetcode/contest/upcoming",
        description: "Fetches upcoming contests from LeetCode.",
      },
    ],
  });
}
