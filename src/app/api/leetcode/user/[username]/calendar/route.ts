import { NextResponse } from "next/server";
import axios from "axios";
export async function GET(req: Request) {
  const username = req.url.split("/")[req.url.split("/").length - 2];
  const query = `
  query getUserProfile($username: String!) {
   matchedUser(username:$username){
   userCalendar{
   activeYears,
   streak,
   totalActiveDays,
   submissionCalendar
   }
   }
    
  }
`;

  const variables = {
    username,
  };

  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      JSON.stringify({
        query,
        variables,
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
      message: "User calendar data fetched successfully",
      data: response.data.data.matchedUser,
      contestData: response.data.data.userCalendar,
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch user calendar data",
      error: err,
    });
  }
}
