import { NextResponse } from "next/server";
import axios from "axios";
export async function GET() {
  const query = `
  query questionOfToday {
  activeDailyCodingChallengeQuestion {
    date
    userStatus
    link
    question {
      acRate
      difficulty
      freqBar
      frontendQuestionId: questionFrontendId
      isFavor
      paidOnly: isPaidOnly
      status
      title
      titleSlug
      hasVideoSolution
      hasSolution
      topicTags {
        name
        id
        slug
      }
    }
  }
}
`;

  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      JSON.stringify({
        query,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      }
    );

    return NextResponse.json({
      status: 200,
      message: "Question of the Day fetched successfully",
      data: response.data.data.activeDailyCodingChallengeQuestion,
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch Question of the Day",
      error: err,
    });
  }
}
