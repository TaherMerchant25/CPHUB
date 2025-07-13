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
