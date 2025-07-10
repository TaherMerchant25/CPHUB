import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
export async function GET(req: Request) {
  const username = req.url.split("/").pop();
  const url = `https://leetcode.com/u/${username}/`;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle0",
  });
  const content = await page.content();
  const $ = cheerio.load(content);
  const rating = $(
    ".text-label-1.dark\\:text-dark-label-1.flex.items-center.text-2xl"
  )
    .text()
    .trim();

  return NextResponse.json({
    status: 200,
    message: "User data fetched successfully",
    rating: rating,
  });
  try {
  } catch (err) {
    return NextResponse.json({
      status: 404,
      message: "User not found",
      err: err,
    });
  }
}
