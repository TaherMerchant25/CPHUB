import * as cheerio from "cheerio";
import axios from "axios";
import { NextResponse } from "next/server";
interface Contest {
  name: string;
  problems?: string[];
}

export async function GET(req: Request) {
  try {
    const username = req.url.split("/").pop();
    const url = `https://www.codechef.com/users/${username}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const contests: Contest[] = [];

    $(".problems-solved .content").each((idx) => {
      const contestName = $(".problems-solved .content h5").eq(idx).text();

      const rawText = $(".problems-solved .content p").eq(idx).text().trim();

      const normalized = rawText.replace(/\u00a0/g, " ").replace(/\s+/g, " ");

      const problems = normalized
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      contests.push({
        name: contestName,
        problems: problems,
      });
    });
    const profile = {
      username: $(".m-username--link").first().text().trim(),
      country: $(".user-country-name").text().trim(),
      problemSolved: $(".problems-solved h3").eq(3).text().trim().split(" ")[3],
      rating: {
        currentRatingNumber: $(".rating-number").text().trim(),
        ratingStar: $(".rating-star").text().trim(),
        highestRating: $(".rating-header small")
          .text()
          .trim()
          .split(" ")[2]
          .replace(")", ""),
        globalRank: $(".rating-ranks strong").first().text().trim(),
        countryRank: $(".rating-ranks strong").last().text().trim(),
      },
      contests: contests,
    };

    return NextResponse.json({
      status: 200,
      data: profile,
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch user data",
      error: err,
    });
  }
}
