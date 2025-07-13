import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get(
      "https://codeforces.com/api/contest.list",
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      }
    );

    const allContests = response.data.result;

    const upcomingContests = allContests.filter(
      (contest: codeforcesContest) => contest.phase === "BEFORE"
    );

    return NextResponse.json({
      status: 200,
      message: "Upcoming contests fetched successfully",
      data: upcomingContests,
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch contest data",
      error: err,
    });
  }
}
