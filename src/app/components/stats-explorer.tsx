"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Platform = "leetcode" | "codeforces" | "codechef";
type LcType = "profile" | "potd" | "calendar" | "upcoming";
type CfType = "profile" | "problems" | "upcoming";
type CcType = "profile" | "problems" | "potd" | "upcoming";

export default function StatsExplorer() {
  const [platform, setPlatform] = useState<Platform>("leetcode");
  const [username, setUsername] = useState("");
  const [type, setType] = useState<LcType | CfType | CcType>("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      let url = "";
      if (platform === "leetcode") {
        if (type === "profile") url = `/api/leetcode/user/${encodeURIComponent(username)}`;
        else if (type === "potd") url = `/api/leetcode/problems/potd`;
        else if (type === "calendar") url = `/api/leetcode/user/${encodeURIComponent(username)}/calendar`;
        else if (type === "upcoming") url = `/api/leetcode/contest/upcoming`;
      } else if (platform === "codeforces") {
        if (type === "profile") url = `/api/codeforces/user/${encodeURIComponent(username)}`;
        else if (type === "problems") url = `/api/codeforces/problems`;
        else if (type === "upcoming") url = `/api/codeforces/contest/upcoming`;
      } else if (platform === "codechef") {
        if (type === "profile") url = `/api/codechef/user/${encodeURIComponent(username)}`;
        else if (type === "problems") url = `/api/codechef/problems`;
        else if (type === "potd") url = `/api/codechef/problems/potd`;
        else if (type === "upcoming") url = `/api/codechef/contest/upcoming`;
      }

      const res = await fetch(url!);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to fetch");

      // Basic invalid-username checks per platform for profile fetches
      if (type === "profile") {
        if (platform === "leetcode" && !json?.data) {
          throw new Error("Invalid username");
        }
        if (platform === "codeforces" && json?.data?.status !== "OK") {
          throw new Error("Invalid username");
        }
        if (platform === "codechef" && !json?.data?.username) {
          throw new Error("Invalid username");
        }
      }

      // For POTD, if username present, also fetch recent AC to determine solved status
      if (platform === "leetcode" && type === "potd" && username) {
        try {
          const acRes = await fetch(`/api/leetcode/user/${encodeURIComponent(username)}/recent-ac`);
          const acJson = await acRes.json();
          json.__recentAC = Array.isArray(acJson?.data) ? acJson.data : [];
        } catch {}
      }

      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const TypeSelector = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="neutral" className="w-44 justify-between">
          {String(type).toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Select type</DropdownMenuLabel>
        {platform === "leetcode" && ["profile","potd","calendar","upcoming"].map((t) => (
          <DropdownMenuItem key={t} onClick={() => setType(t as LcType)}>
            {t}
          </DropdownMenuItem>
        ))}
        {platform === "codeforces" && ["profile","problems","upcoming"].map((t) => (
          <DropdownMenuItem key={t} onClick={() => setType(t as CfType)}>
            {t}
          </DropdownMenuItem>
        ))}
        {platform === "codechef" && ["profile","problems","potd","upcoming"].map((t) => (
          <DropdownMenuItem key={t} onClick={() => setType(t as CcType)}>
            {t}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const SectionHeader = (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      <Input
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TypeSelector />
      <Button onClick={fetchStats} disabled={loading || (!username && type === "profile")}>Submit</Button>
    </div>
  );

  const Warning = ({ text }: { text: string }) => (
    <div className="flex flex-col items-center justify-center border rounded-base p-8 bg-yellow-50 text-yellow-800">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
      <div className="text-sm font-medium">{text}</div>
    </div>
  );

  const RenderLeetCode = () => {
    if (!data) return null;
    if (type === "profile") {
      const user = data?.data;
      if (!user) return <Warning text="Username Invalid" />;
      const contest = data?.contestData;
      // difficulty keys can be 'Easy', 'Medium', 'Hard' (case-sensitive). Normalize.
      const acMap: Record<string, number> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (user?.submitStats?.acSubmissionNum || []).forEach((s: any) => {
        const key = String(s.difficulty || "").toLowerCase();
        if (key) acMap[key] = s.count;
      });
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <CardTitle className="mb-2">{user?.username}</CardTitle>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Ranking</span><span className="font-semibold">{user?.profile?.ranking ?? "-"}</span></div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardTitle className="mb-2">AC by Difficulty</CardTitle>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <Card className="p-3"><div className="text-xs">Easy</div><div className="text-lg font-semibold">{acMap["easy"] ?? 0}</div></Card>
                <Card className="p-3"><div className="text-xs">Medium</div><div className="text-lg font-semibold">{acMap["medium"] ?? 0}</div></Card>
                <Card className="p-3"><div className="text-xs">Hard</div><div className="text-lg font-semibold">{acMap["hard"] ?? 0}</div></Card>
              </div>
            </CardContent>
          </Card>
          {contest && (
            <Card className="p-4 md:col-span-2">
              <CardTitle className="mb-2">Contest</CardTitle>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div><div className="text-xs">Rating</div><div className="text-lg font-semibold">{contest.rating ?? '-'}</div></div>
                  <div><div className="text-xs">Global Rank</div><div className="text-lg font-semibold">{contest.globalRanking ?? '-'}</div></div>
                  <div><div className="text-xs">Attended</div><div className="text-lg font-semibold">{contest.attendedContestsCount ?? '-'}</div></div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }
    if (type === "potd") {
      const d = data?.data;
      const q = d?.question;
      const difficultyColor = q?.difficulty === "Easy" ? "bg-green-100 text-green-800 border-green-300" : q?.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800 border-yellow-300" : "bg-red-100 text-red-800 border-red-300";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const solved = Array.isArray((data as any)?.__recentAC) && (data as any).__recentAC.some((s: any) => s.titleSlug === q?.titleSlug);
      return (
        <Card className="p-5">
          <CardTitle className="mb-2">LeetCode POTD — {d?.date}</CardTitle>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <a
                  href={`https://leetcode.com${d?.link ?? "/problemset/"}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg font-semibold hover:underline"
                >
                  {q?.frontendQuestionId}. {q?.title}
                </a>
                <span className={`px-2 py-1 text-xs rounded-base border ${difficultyColor}`}>{q?.difficulty}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-foreground/70">
                <div>AC Rate: <span className="font-medium">{q?.acRate ? `${q.acRate.toFixed(1)}%` : "-"}</span></div>
                {username && (
                  <div className={`px-2 py-1 rounded-base border text-xs ${solved ? "bg-green-100 text-green-800 border-green-300" : "bg-yellow-100 text-yellow-800 border-yellow-300"}`}>
                    {solved ? "Solved Today" : "Not Solved Yet"}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(q?.topicTags || []).map((t: any) => (
                  <span key={t.slug} className="text-xs px-2 py-1 rounded-base border bg-secondary-background">{t.name}</span>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2 text-sm">
                <div className="p-3 rounded-base border"><div className="text-xs text-foreground/70">Paid Only</div><div className="font-medium">{q?.paidOnly ? "Yes" : "No"}</div></div>
                <div className="p-3 rounded-base border"><div className="text-xs text-foreground/70">Has Solution</div><div className="font-medium">{q?.hasSolution ? "Yes" : "No"}</div></div>
                <div className="p-3 rounded-base border"><div className="text-xs text-foreground/70">Video</div><div className="font-medium">{q?.hasVideoSolution ? "Yes" : "No"}</div></div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
    if (type === "calendar") {
      const d = data?.data?.userCalendar || data?.data; // route returns matchedUser with userCalendar
      const calStr = d?.userCalendar?.submissionCalendar || d?.submissionCalendar;
      let totalSubs = 0;
      try {
        const obj = typeof calStr === "string" ? JSON.parse(calStr) : {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        totalSubs = Object.values(obj).reduce((a: number, b: any) => a + Number(b || 0), 0);
      } catch {}
      const totalActiveDays = d?.userCalendar?.totalActiveDays || d?.totalActiveDays;
      const streak = d?.userCalendar?.streak || d?.streak;
      return (
        <Card className="p-5">
          <CardTitle className="mb-2">Calendar Summary</CardTitle>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-base border"><div className="text-xs text-foreground/70">Total Submissions</div><div className="text-lg font-semibold">{totalSubs}</div></div>
              <div className="p-3 rounded-base border"><div className="text-xs text-foreground/70">Active Days</div><div className="text-lg font-semibold">{totalActiveDays ?? '-'}</div></div>
              <div className="p-3 rounded-base border"><div className="text-xs text-foreground/70">Streak</div><div className="text-lg font-semibold">{streak ?? '-'}</div></div>
            </div>
          </CardContent>
        </Card>
      );
    }
    if (type === "upcoming") {
      const contests = data?.contests || [];
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {contests.map((c: any) => (
            <Card key={c.titleSlug} className="p-4">
              <CardTitle className="mb-1">{c.title}</CardTitle>
              <CardContent>
                <div className="text-sm text-foreground/70">{new Date((c.startTime || 0) * 1000).toLocaleString()}</div>
                <div className="text-sm">Duration: {Math.round((c.duration || 0) / 3600)}h</div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    if (type === "problems") {
      // Support both our normalized API shape { data: Question[] }
      // and any raw GraphQL-like nested shapes if they sneak through
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let list: any = data?.data;
      if (!Array.isArray(list)) {
        list = data?.data?.questions
          || data?.questions
          || data?.data?.problemsetQuestionList?.questions
          || [];
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const questions: any[] = Array.isArray(list) ? list : [];
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {questions.slice(0, 20).map((q: any) => (
            <Card key={q.titleSlug} className="p-4">
              <CardTitle className="mb-2 flex items-center justify-between">
                <a className="hover:underline" target="_blank" rel="noreferrer" href={`https://leetcode.com/problems/${q.titleSlug}/`}>
                  {q.frontendQuestionId}. {q.title}
                </a>
                <span className={`px-2 py-1 text-xs rounded-base border ${q.difficulty === "Easy" ? "bg-green-100 text-green-800 border-green-300" : q.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800 border-yellow-300" : "bg-red-100 text-red-800 border-red-300"}`}>{q.difficulty}</span>
              </CardTitle>
              <CardContent>
                <div className="text-sm mb-2">AC Rate: <span className="font-medium">{q.acRate ? `${q.acRate.toFixed?.(1) ?? q.acRate}%` : '-'}</span></div>
                <div className="flex gap-2 flex-wrap">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(q.topicTags || []).slice(0, 5).map((t: any) => (
                    <span key={t.slug} className="text-xs px-2 py-1 rounded-base border bg-secondary-background">{t.name}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    return (
      <pre className="text-xs p-4 bg-secondary-background border rounded-base overflow-auto">{JSON.stringify(data, null, 2)}</pre>
    );
  };

  const RenderCodeforces = () => {
    if (!data) return null;
    if (type === "profile") {
      const user = Array.isArray(data?.data?.result) ? data.data.result[0] : undefined;
      if (!user) return null;
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <CardTitle className="mb-2">{user.handle}</CardTitle>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Rating</span><span className="font-semibold">{user.rating ?? '-'}</span></div>
                <div className="flex justify-between"><span>Max Rating</span><span className="font-semibold">{user.maxRating ?? '-'}</span></div>
                <div className="flex justify-between"><span>Rank</span><span className="font-semibold">{user.rank ?? '-'}</span></div>
                <div className="flex justify-between"><span>Max Rank</span><span className="font-semibold">{user.maxRank ?? '-'}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    return (
      <pre className="text-xs p-4 bg-secondary-background border rounded-base overflow-auto">{JSON.stringify(data, null, 2)}</pre>
    );
  };

  const RenderCodechef = () => {
    if (!data) return null;
    if (type === "profile") {
      const user = data?.data;
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <CardTitle className="mb-2">{user?.username}</CardTitle>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Country</span><span className="font-semibold">{user?.country ?? '-'}</span></div>
                <div className="flex justify-between"><span>Solved</span><span className="font-semibold">{user?.problemSolved ?? '-'}</span></div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardTitle className="mb-2">Rating</CardTitle>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Current</span><span className="font-semibold">{user?.rating?.currentRatingNumber ?? '-'}</span></div>
                <div className="flex justify-between"><span>Highest</span><span className="font-semibold">{user?.rating?.highestRating ?? '-'}</span></div>
                <div className="flex justify-between"><span>Global Rank</span><span className="font-semibold">{user?.rating?.globalRank ?? '-'}</span></div>
                <div className="flex justify-between"><span>Country Rank</span><span className="font-semibold">{user?.rating?.countryRank ?? '-'}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    return (
      <pre className="text-xs p-4 bg-secondary-background border rounded-base overflow-auto">{JSON.stringify(data, null, 2)}</pre>
    );
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-2xl border-4">
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-center">Interactive Statistics</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="leetcode">LeetCode</TabsTrigger>
                <TabsTrigger value="codeforces">Codeforces</TabsTrigger>
                <TabsTrigger value="codechef">CodeChef</TabsTrigger>
              </TabsList>

              <TabsContent value="leetcode" className="mt-6">
                {SectionHeader}
                {loading && <div className="mt-6 text-sm">Loading...</div>}
                {error && <div className="mt-6 text-sm text-red-600">{error}</div>}
                {!loading && !error && data && <div className="mt-6"><RenderLeetCode /></div>}
              </TabsContent>

              <TabsContent value="codeforces" className="mt-6">
                {SectionHeader}
                {loading && <div className="mt-6 text-sm">Loading...</div>}
                {error && <div className="mt-6 text-sm text-red-600">{error}</div>}
                {!loading && !error && data && <div className="mt-6"><RenderCodeforces /></div>}
              </TabsContent>

              <TabsContent value="codechef" className="mt-6">
                {SectionHeader}
                {loading && <div className="mt-6 text-sm">Loading...</div>}
                {error && <div className="mt-6 text-sm text-red-600">{error}</div>}
                {!loading && !error && data && <div className="mt-6"><RenderCodechef /></div>}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}


