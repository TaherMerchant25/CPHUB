import { NextResponse } from "next/server";
import axios from "axios";
export async function GET() {
  try {
    const response = await axios.post(
      `https://codeforces.com/api/contest.list`,

      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      }
    );

    return NextResponse.json({
      status: 200,
      message: "User data fetched successfully",
      data: response.data,
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch user data",
      error: err,
    });
  }
}
