interface TopicTag {
  name: string;
  id: string;
  slug: string;
}

interface LeetCodeQuestion {
  acRate: number;
  difficulty: "Easy" | "Medium" | "Hard";
  freqBar: number | null;
  frontendQuestionId: string;
  isFavor: boolean;
  paidOnly: boolean;
  status: string | null;
  title: string;
  titleSlug: string;
  topicTags: TopicTag[];
  hasSolution: boolean;
  hasVideoSolution: boolean;
}


interface CodeChefProblem {
  title: string;
  problemCode: string;
  difficulty: string;
  tags?: string[];
  successfulSubmissions?: string;
  totalSubmissions?: string;
  accuracy?: string;
  contestName?: string;
  url: string;
}

interface CodeChefContest {
  name: string;
  startDate: string;
  endDate: string;
  duration: string;
  url: string;
  status: "upcoming" | "running" | "ended";
}

interface CodeChefAPIContest {
  contest_code: string;
  contest_name: string;
  contest_start_date: string;
  contest_end_date: string;
  contest_start_date_iso: string;
  contest_end_date_iso: string;
  contest_duration: string;
  distinct_users: number;
}

interface Contest {
  name: string;
  problems?: string[];
}

interface codeforcesContest {
  id: number;
  name: string;
  type: string;
  phase: string;
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds: string;
  relativeTimeSeconds: string;
}

interface codeforcesProblem {
  contestId: number;
  index: string;
  name: string;
  type: string;
  points: number;
  tags: string[];
}
