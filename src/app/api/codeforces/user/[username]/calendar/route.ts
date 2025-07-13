import { NextResponse } from "next/server";
import axios from "axios";
export async function GET(req: Request) {
  const username = req.url.split("/")[req.url.split("/").length - 2];

  try {
    const response = await axios.post(
      `https://codeforces.com/api/user.status?handle=${username}`,

      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      }
    );

    return NextResponse.json({
      status: 200,
      message: "User submission data fetched successfully",
      data: response.data,
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch user submission data",
      error: err,
    });
  }
}
