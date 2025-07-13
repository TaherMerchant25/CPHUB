import { NextResponse } from "next/server";
import axios from "axios";
export async function GET() {
  try {
    const response = await axios.post(
      `https://codeforces.com/api/problemset.problems`,

      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      }
    );

    return NextResponse.json({
      status: 200,
      message: "Problem set fetched successfully",
      data: response.data,
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch problem set",
      error: err,
    });
  }
}
