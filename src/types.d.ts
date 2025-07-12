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
