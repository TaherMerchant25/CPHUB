import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const categorySlug = searchParams.get("category") || "";
  const skip = Number(searchParams.get("skip")) || 0;
  const frontendQuestionId =
    searchParams.get("frontendQuestionId")?.toLowerCase() || "";
  const difficulty = searchParams.get("difficulty")?.toLowerCase() || "";
  const tags = searchParams.getAll("tags").map((tag) => tag.toLowerCase());

  const query = `
    query problemsetQuestionList(
      $categorySlug: String
      $limit: Int
      $skip: Int
      $filters:QuestionListFilterInput
  
    ) {
      problemsetQuestionList: questionList(
        categorySlug: $categorySlug
        limit: $limit
        skip: $skip
        filters: $filters
        
      ) {
        total: totalNum
        questions: data {
          acRate
          difficulty
          freqBar
          frontendQuestionId: questionFrontendId
          isFavor
          paidOnly: isPaidOnly
          status
          title
          titleSlug
          topicTags {
            name
            id
            slug
          }
          hasSolution
          hasVideoSolution
        }
      }
    }
  `;

  const variables = {
    categorySlug,
    skip,
    limit: 4000,
    filters: {},
  };

  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      {
        query,
        variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
        },
      }
    );
    console.log("Response data:", response.data);

    let LeetCodeQuestions: LeetCodeQuestion[] =
      response.data.data.problemsetQuestionList.questions;

    if (frontendQuestionId) {
      LeetCodeQuestions = LeetCodeQuestions.filter(
        (q) =>
          q.frontendQuestionId.toLowerCase() === frontendQuestionId ||
          q.titleSlug.toLowerCase() === frontendQuestionId
      );
    }

    if (difficulty) {
      LeetCodeQuestions = LeetCodeQuestions.filter(
        (q) => q.difficulty.toLowerCase() === difficulty
      );
    }

    if (tags.length > 0) {
      LeetCodeQuestions = LeetCodeQuestions.filter((q) =>
        tags.every((tag) =>
          q.topicTags.some((topicTag) => topicTag.slug.toLowerCase() === tag)
        )
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Questions fetched successfully",
      data: LeetCodeQuestions,
      total: LeetCodeQuestions.length,
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch questions",
      error: err,
    });
  }
}
