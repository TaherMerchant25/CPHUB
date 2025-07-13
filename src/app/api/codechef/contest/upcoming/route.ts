import axios from "axios";
import { NextResponse } from "next/server";
import { cache } from "@/lib/cache";

interface CodeChefAPIResponse {
  status: string;
  message: string;
  present_contests: CodeChefAPIContest[];
  future_contests: CodeChefAPIContest[];
  practice_contests: CodeChefAPIContest[];
  past_contests: CodeChefAPIContest[];
}

export async function GET() {
  try {
    const cacheKey = cache.generateKey("codechef", "contests", "upcoming");
    
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const apiUrl = "https://www.codechef.com/api/list/contests/all";
    const { data: apiResponse }: { data: CodeChefAPIResponse } = await axios.get(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Contest API)',
      }
    });

    const upcomingContests: CodeChefContest[] = [];
    const runningContests: CodeChefContest[] = [];

    if (apiResponse.present_contests && apiResponse.present_contests.length > 0) {
      apiResponse.present_contests.forEach((contest: CodeChefAPIContest) => {
        const contestData: CodeChefContest = {
          name: contest.contest_name,
          startDate: contest.contest_start_date,
          endDate: contest.contest_end_date,
          duration: `${Math.floor(parseInt(contest.contest_duration) / 60)} hours ${parseInt(contest.contest_duration) % 60} minutes`,
          url: `https://www.codechef.com/${contest.contest_code}`,
          status: "running",
        };
        runningContests.push(contestData);
      });
    }

    if (apiResponse.future_contests && apiResponse.future_contests.length > 0) {
      apiResponse.future_contests.forEach((contest: CodeChefAPIContest) => {
        const contestData: CodeChefContest = {
          name: contest.contest_name,
          startDate: contest.contest_start_date,
          endDate: contest.contest_end_date,
          duration: `${Math.floor(parseInt(contest.contest_duration) / 60)} hours ${parseInt(contest.contest_duration) % 60} minutes`,
          url: `https://www.codechef.com/${contest.contest_code}`,
          status: "upcoming",
        };
        upcomingContests.push(contestData);
      });
    }



    const uniqueUpcoming = upcomingContests.filter((contest, index, self) => 
      index === self.findIndex(c => c.name === contest.name)
    );
    
    const uniqueRunning = runningContests.filter((contest, index, self) => 
      index === self.findIndex(c => c.name === contest.name)
    );

    const response = {
      status: 200,
      message: "Contests fetched successfully",
      data: {
        upcoming: uniqueUpcoming.slice(0, 10),  
        running: uniqueRunning.slice(0, 5),    
      },
      total: {
        upcoming: uniqueUpcoming.length,
        running: uniqueRunning.length,
      },
      source: "CodeChef Official API"
    };

    await cache.set(cacheKey, response, 1800);

    return NextResponse.json(response);
  } catch (err) {
    console.error("Error fetching CodeChef contests:", err);
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch contest data",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
