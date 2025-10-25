"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trophy, Medal, Award } from "lucide-react";

interface User {
  id: number;
  username: string;
  total: number;
  easy: number;
  medium: number;
  hard: number;
}

export default function RankingPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tracker/users");
      const data = await response.json();
      setUsers(data);
    } catch {
      toast.error("Error fetching users");
    }
    setLoading(false);
  };

  const bulkImportUsers = async () => {
    setImporting(true);
    try {
      // Parse the usernames from 1.txt data
      const usernamesData = [
        "rIwtJjkvXG", "Shyyshawarma", "shivaaydhondiyal23", "shreyansh-100",
        "ghXc1g3X3j", "Sarthakvzz", "ridhwandeshwal", "hi_phi_rai",
        "him_25_ani", "Mystique_xxx", "kushalkhemka", "gitgitgit",
        "shubhank165", "mehtaaneesh", "Godwitiyo", "prisha_08",
        "pihuagrawal", "Amick", "vanshikaxcx", "shnjnmkkr",
        "Platinum_X4", "nahmahn", "a_for_aarushi", "sukrititalwar",
        "du9E8NkFSv", "Akansh_26", "RudyOverflow", "0xCipherX",
        "klatKeRO8V", "dheeraj0923", "ShinRa_04", "manva_niso",
        "Arpitsinha", "MrMerchant_25", "mayank-jangid-moon", "Ishansh_Sharma",
        "ghostiee-11", "devanshh06", "rishishah010806", "Riddhi_Sharma27",
        "LordHammer", "anishaagoel", "armaantokas"
      ];

      const response = await fetch("/api/tracker/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernames: usernamesData }),
      });

      const result = await response.json();
      
      toast.success(
        `Import complete! Added: ${result.added}, Updated: ${result.updated}, Failed: ${result.failed.length}`
      );
      
      if (result.failed.length > 0) {
        console.log("Failed imports:", result.failed);
      }
      
      await fetchUsers();
    } catch {
      toast.error("Error importing users");
    }
    setImporting(false);
  };

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return <Trophy className="w-6 h-6 text-yellow-500 inline-block mr-2" />;
    } else if (index === 1) {
      return <Medal className="w-6 h-6 text-gray-400 inline-block mr-2" />;
    } else if (index === 2) {
      return <Award className="w-6 h-6 text-amber-700 inline-block mr-2" />;
    }
    return null;
  };

  const getRankClass = (index: number) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-900/10 border-l-4 border-yellow-500";
    if (index === 1) return "bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800/30 dark:to-gray-800/10 border-l-4 border-gray-400";
    if (index === 2) return "bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-900/10 border-l-4 border-amber-700";
    return "";
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-8 border-2 shadow-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-4xl font-heading">
                  🏆 LeetCode Rankings
                </CardTitle>
                <p className="text-foreground/70 mt-2">
                  Top performers ranked by total problems solved
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={fetchUsers} disabled={loading || importing}>
                  Refresh
                </Button>
                <Button 
                  onClick={bulkImportUsers} 
                  disabled={loading || importing}
                  variant="neutral"
                >
                  {importing ? "Importing..." : "Import All Users"}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-foreground/70">Loading rankings...</p>
          </div>
        ) : users.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-foreground/70 mb-4">
                No users found. Click &quot;Import All Users&quot; to load the rankings!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {users.map((user, index) => (
              <Card
                key={user.id}
                className={`border-2 shadow-shadow transition-all duration-300 hover:scale-[1.01] ${getRankClass(
                  index
                )}`}
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Rank */}
                    <div className="md:col-span-1 text-center">
                      <div className="text-3xl font-heading font-bold text-foreground/70">
                        #{index + 1}
                      </div>
                    </div>

                    {/* Username with Badge */}
                    <div className="md:col-span-4">
                      <div className="flex items-center">
                        {getRankBadge(index)}
                        <span className="text-xl font-semibold">{user.username}</span>
                      </div>
                    </div>

                    {/* Total Score */}
                    <div className="md:col-span-2 text-center">
                      <div className="text-sm text-foreground/70 mb-1">Total Solved</div>
                      <div className="text-3xl font-bold text-chart-1">{user.total}</div>
                    </div>

                    {/* Difficulty Breakdown */}
                    <div className="md:col-span-5 grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-green-100 dark:bg-green-950 rounded-base border-2 border-green-500">
                        <div className="text-xs text-green-700 dark:text-green-300 font-semibold mb-1">
                          Easy
                        </div>
                        <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                          {user.easy}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-yellow-100 dark:bg-yellow-950 rounded-base border-2 border-yellow-500">
                        <div className="text-xs text-yellow-700 dark:text-yellow-300 font-semibold mb-1">
                          Medium
                        </div>
                        <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                          {user.medium}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-red-100 dark:bg-red-950 rounded-base border-2 border-red-500">
                        <div className="text-xs text-red-700 dark:text-red-300 font-semibold mb-1">
                          Hard
                        </div>
                        <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                          {user.hard}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
