import axios from "axios";
import { NextResponse } from "next/server";
import { cache } from "@/lib/cache";

interface CodeChefAPIProblem {
  id: string;
  code: string;
  name: string;
  difficulty_rating: string;
  total_submissions: string;
  successful_submissions: string;
  distinct_successful_submissions: string;
  partially_successful_submissions: string;
  intended_contest_id: string;
  actual_intended_contests: number[];
  contest_code: string | null;
}

async function fetchCodeChefProblems(limit: number = 20): Promise<CodeChefProblem[]> {
  const problems: CodeChefProblem[] = [];
  
  try {
    console.log('fetching all codechef problems...');
    
    const response = await axios.get<{
      status: string;
      message: string;
      data: CodeChefAPIProblem[];
      count: number;
    }>('https://www.codechef.com/api/list/problems?limit=3000', {
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (response.data.status === 'success' && response.data.data) {
      const allApiProblems = response.data.data;

      console.log(`Fetched ${allApiProblems.length} total problems from CodeChef API`);

      const apiProblems = allApiProblems.filter((p: CodeChefAPIProblem) => 
        p.name && 
        p.code &&
        p.name.trim() !== ""
      );

      const mapDifficultyRating = (rating: string): string => {
        const numRating = parseInt(rating);
        if (numRating <= 500) return "Easy";
        if (numRating <= 1000) return "Easy-Medium";
        if (numRating <= 1400) return "Medium";
        if (numRating <= 1800) return "Medium-Hard";
        if (numRating <= 2200) return "Hard";
        return "Challenge";
      };

      for (let i = 0; i < Math.min(apiProblems.length, limit); i++) {
        const problem = apiProblems[i];
        
        problems.push({
          title: problem.name,
          problemCode: problem.code,
          difficulty: problem.difficulty_rating === "-1" ? "Unrated" : mapDifficultyRating(problem.difficulty_rating),
          url: `https://www.codechef.com/problems/${problem.code}`,
          successfulSubmissions: problem.successful_submissions || "0",
          accuracy: problem.total_submissions && problem.successful_submissions ? 
            `${((parseInt(problem.successful_submissions) / parseInt(problem.total_submissions)) * 100).toFixed(1)}%` : 
            "N/A"
        });
      }
    }

  } catch (error) {
    console.error('Error fetching CodeChef problems via API:', error);
    console.log('Falling back to empty response due to API error');
    return [];
  }

  console.log(`Successfully fetched ${problems.length} problems from CodeChef API`);
  return problems;
}


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 3000);  

    const fullCacheKey = cache.generateKey("codechef", "all-problems");
    
    let allProblems: CodeChefProblem[] = [];
    const cachedData = await cache.get(fullCacheKey);
    
    if (cachedData && Array.isArray(cachedData)) {
      console.log('Using cached CodeChef problems');
      allProblems = cachedData;
    } else {
      console.log('Cache miss - fetching fresh data from CodeChef API');
      allProblems = await fetchCodeChefProblems(3000); // Get all problems
      
      if (allProblems.length > 0) {
        await cache.set(fullCacheKey, allProblems, 7200);
      }
    }

    const problems = allProblems.slice(0, limit);

    const response = {
      status: 200,
      message: problems.length > 0 ? "Problems fetched successfully" : "No problems found",
      data: problems,
      total: problems.length,
      totalAvailable: allProblems.length,
      filters: {
        limit,
      },
      source: cachedData ? "cache" : "api",
      debug: problems.length > 0 ? 
        `Successfully served ${problems.length} problems from ${allProblems.length} available (${cachedData ? 'cached' : 'fresh'} data)` : 
        "No problems returned"
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Error fetching CodeChef problems:", err);
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch problems",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
