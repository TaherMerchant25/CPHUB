"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Platform = "leetcode" | "codeforces" | "codechef";

interface FetchState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

export default function DashboardPage() {
  const [username, setUsername] = useState("");
  const [activePlatform, setActivePlatform] = useState<Platform>("leetcode");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lc, setLc] = useState<FetchState<any>>({ loading: false, error: null, data: null });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cf, setCf] = useState<FetchState<any>>({ loading: false, error: null, data: null });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cc, setCc] = useState<FetchState<any>>({ loading: false, error: null, data: null });

  const handleSearch = async () => {
    if (!username.trim()) return;

    setLc({ loading: true, error: null, data: null });
    setCf({ loading: true, error: null, data: null });
    setCc({ loading: true, error: null, data: null });

    try {
      const [lcRes, cfRes, ccRes] = await Promise.all([
        fetch(`/api/leetcode/user/${encodeURIComponent(username)}`),
        fetch(`/api/codeforces/user/${encodeURIComponent(username)}`),
        fetch(`/api/codechef/user/${encodeURIComponent(username)}`),
      ]);

      const [lcJson, cfJson, ccJson] = await Promise.all([
        lcRes.json(),
        cfRes.json(),
        ccRes.json(),
      ]);

      setLc({
        loading: false,
        error: lcRes.ok ? null : lcJson?.message || "Failed to fetch",
        data: lcRes.ok ? lcJson : null,
      });
      setCf({
        loading: false,
        error: cfRes.ok ? null : cfJson?.message || "Failed to fetch",
        data: cfRes.ok ? cfJson : null,
      });
      setCc({
        loading: false,
        error: ccRes.ok ? null : ccJson?.message || "Failed to fetch",
        data: ccRes.ok ? ccJson : null,
      });
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : "Unknown error";
      setLc({ loading: false, error: errMsg, data: null });
      setCf({ loading: false, error: errMsg, data: null });
      setCc({ loading: false, error: errMsg, data: null });
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const StatRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-foreground/70">{label}</span>
      <span className="font-medium">{value ?? "-"}</span>
    </div>
  );

  const LeetCodeCard = () => {
    const data = lc.data;
    const profile = data?.data;
    const contest = data?.contestData;
    const acStats: Array<{ difficulty: string; count: number; submissions: number }> =
      profile?.submitStats?.acSubmissionNum || [];
    const acByDiff = Object.fromEntries(acStats.map((s) => [s.difficulty, s.count]));

    return (
      <Card>
        <CardHeader>
          <CardTitle>LeetCode</CardTitle>
        </CardHeader>
        <CardContent>
          {lc.loading && <p className="text-sm">Loading...</p>}
          {lc.error && <p className="text-sm text-red-600">{lc.error}</p>}
          {!lc.loading && !lc.error && profile && (
            <div className="space-y-2">
              <StatRow label="Username" value={profile.username} />
              <StatRow label="Ranking" value={profile.profile?.ranking} />
              <StatRow label="Reputation" value={profile.profile?.reputation} />
              <div className="mt-3">
                <div className="text-xs mb-1 text-foreground/70">AC by difficulty</div>
                <div className="grid grid-cols-3 gap-2">
                  <Card className="p-3"><div className="text-xs">Easy</div><div className="text-lg font-semibold">{acByDiff.EASY ?? 0}</div></Card>
                  <Card className="p-3"><div className="text-xs">Medium</div><div className="text-lg font-semibold">{acByDiff.MEDIUM ?? 0}</div></Card>
                  <Card className="p-3"><div className="text-xs">Hard</div><div className="text-lg font-semibold">{acByDiff.HARD ?? 0}</div></Card>
                </div>
              </div>
              {contest && (
                <div className="mt-3">
                  <div className="text-xs mb-1 text-foreground/70">Contest</div>
                  <StatRow label="Rating" value={contest.rating} />
                  <StatRow label="Global Rank" value={contest.globalRanking} />
                  <StatRow label="Attended" value={contest.attendedContestsCount} />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const CodeforcesCard = () => {
    const data = cf.data?.data; // API returns { status, message, data }
    const user = Array.isArray(data?.result) ? data.result[0] : undefined;
    return (
      <Card>
        <CardHeader>
          <CardTitle>Codeforces</CardTitle>
        </CardHeader>
        <CardContent>
          {cf.loading && <p className="text-sm">Loading...</p>}
          {cf.error && <p className="text-sm text-red-600">{cf.error}</p>}
          {!cf.loading && !cf.error && user && (
            <div className="space-y-2">
              <StatRow label="Handle" value={user.handle} />
              <StatRow label="Rating" value={user.rating} />
              <StatRow label="Max Rating" value={user.maxRating} />
              <StatRow label="Rank" value={user.rank} />
              <StatRow label="Max Rank" value={user.maxRank} />
              <StatRow label="Contribution" value={user.contribution} />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const CodeChefCard = () => {
    const profile = cc.data?.data;
    return (
      <Card>
        <CardHeader>
          <CardTitle>CodeChef</CardTitle>
        </CardHeader>
        <CardContent>
          {cc.loading && <p className="text-sm">Loading...</p>}
          {cc.error && <p className="text-sm text-red-600">{cc.error}</p>}
          {!cc.loading && !cc.error && profile && (
            <div className="space-y-2">
              <StatRow label="Username" value={profile.username} />
              <StatRow label="Country" value={profile.country} />
              <StatRow label="Problems Solved" value={profile.problemSolved} />
              <div className="mt-3">
                <div className="text-xs mb-1 text-foreground/70">Rating</div>
                <StatRow label="Current" value={profile.rating?.currentRatingNumber} />
                <StatRow label="Stars" value={profile.rating?.ratingStar} />
                <StatRow label="Highest" value={profile.rating?.highestRating} />
                <StatRow label="Global Rank" value={profile.rating?.globalRank} />
                <StatRow label="Country Rank" value={profile.rating?.countryRank} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <Card className="border-4">
          <CardHeader>
            <CardTitle className="text-2xl">Platform Stats Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activePlatform} onValueChange={(v) => setActivePlatform(v as Platform)}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="leetcode">LeetCode</TabsTrigger>
            <TabsTrigger value="codeforces">Codeforces</TabsTrigger>
            <TabsTrigger value="codechef">CodeChef</TabsTrigger>
          </TabsList>

          <TabsContent value="leetcode" className="mt-6">
            <LeetCodeCard />
          </TabsContent>
          <TabsContent value="codeforces" className="mt-6">
            <CodeforcesCard />
          </TabsContent>
          <TabsContent value="codechef" className="mt-6">
            <CodeChefCard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


