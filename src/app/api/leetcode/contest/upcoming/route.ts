import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const query = `
    query getUpcomingContests {
      upcomingContests {
        title
        titleSlug
        startTime
        duration
        __typename
      }
    }
  `;

  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      JSON.stringify({ query }),
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      }
    );

    return NextResponse.json({
      status: 200,
      message: "Contests fetched successfully",
      contests: response.data.data.upcomingContests,
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch contest data",
      error: err,
    });
  }
}
