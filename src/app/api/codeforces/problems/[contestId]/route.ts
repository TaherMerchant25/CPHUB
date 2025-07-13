import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const index = searchParams.get("index");

  const contestId = req.url.split("/").slice(-2)[0];

  if (!contestId || !index) {
    return NextResponse.json({
      status: 400,
      message: "Missing contestId or index in the request",
    });
  }

  try {
    const response = await axios.get(
      `https://codeforces.com/api/problemset.problems`,
      {
        params: {
          contestId,
        },
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      }
    );

    const problems = response.data.result.problems;
    const problem = problems.find((p: codeforcesProblem) => p.index === index);

    if (!problem) {
      return NextResponse.json({
        status: 404,
        message: `Problem ${index} not found in contest ${contestId}`,
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Problem data fetched successfully",
      data: problem,
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch problem data",
      error: err,
    });
  }
}
