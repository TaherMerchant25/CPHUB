"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface User {
  id: number;
  username: string;
  total: number;
  easy: number;
  medium: number;
  hard: number;
}

interface CheckResult {
  username: string;
  has_solved: boolean;
}

type SortColumn = "username" | "total" | "easy" | "medium" | "hard";
type SortDirection = "asc" | "desc";

export default function LeetCodeTracker() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [checkResults, setCheckResults] = useState<CheckResult[]>([]);
  const [sortColumn, setSortColumn] = useState<SortColumn>("total");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tracker/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error("Error fetching users: " + (error instanceof Error ? error.message : "Unknown error"));
    }
    setLoading(false);
  };

  const addUser = async () => {
    if (!usernameInput.trim()) {
      toast.error("Please enter a username");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/tracker/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add user");
      }

      toast.success(`User ${usernameInput} added successfully!`);
      setUsernameInput("");
      await fetchUsers();
    } catch (error) {
      toast.error("Error adding user: " + (error instanceof Error ? error.message : "Unknown error"));
    }
    setLoading(false);
  };

  const updateAllUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tracker/update");
      const data = await response.json();
      toast.success(`Updated ${data.updated}/${data.total} users`);
      if (data.errors.length > 0) {
        toast.error(`${data.errors.length} users failed to update`);
      }
      await fetchUsers();
    } catch (error) {
      toast.error("Error updating users: " + (error instanceof Error ? error.message : "Unknown error"));
    }
    setLoading(false);
  };

  const checkQuestion = async () => {
    if (!questionInput.trim()) {
      toast.error("Please enter a question name");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/tracker/check/${encodeURIComponent(questionInput)}`);
      const results = await response.json();
      setCheckResults(results);
    } catch (error) {
      toast.error("Error checking question: " + (error instanceof Error ? error.message : "Unknown error"));
    }
    setLoading(false);
  };

  const deleteUser = async (username: string) => {
    if (!confirm(`Are you sure you want to delete ${username}?`)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/tracker/users/${username}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      toast.success(`User ${username} deleted successfully`);
      await fetchUsers();
    } catch (error) {
      toast.error("Error deleting user: " + (error instanceof Error ? error.message : "Unknown error"));
    }
    setLoading(false);
  };

  const sortTable = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return " ⇅";
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  const solvedCount = checkResults.filter((r) => r.has_solved).length;

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-8 border-2 shadow-shadow">
          <CardHeader>
            <CardTitle className="text-4xl font-heading">
              🎯 LeetCode Tracker
            </CardTitle>
            <p className="text-foreground/70">
              Track and compare LeetCode progress across users
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add User Section */}
            <div className="flex gap-4 flex-wrap">
              <Input
                type="text"
                placeholder="Enter LeetCode username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addUser()}
                className="flex-1 min-w-[200px]"
              />
              <Button onClick={addUser} disabled={loading}>
                Add User
              </Button>
              <Button onClick={updateAllUsers} disabled={loading} variant="neutral">
                Update All
              </Button>
            </div>

            {/* Check Question Section */}
            <div className="flex gap-4 flex-wrap pt-4 border-t">
              <Input
                type="text"
                placeholder="Enter question name (e.g., 'Two Sum')"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && checkQuestion()}
                className="flex-1 min-w-[200px]"
              />
              <Button onClick={checkQuestion} disabled={loading}>
                Check Question
              </Button>
            </div>

            {/* Check Results */}
            {checkResults.length > 0 && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-xl">
                    Question: &quot;{questionInput}&quot; ({solvedCount}/{checkResults.length} solved)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {checkResults.map((result) => (
                    <div
                      key={result.username}
                      className={`flex justify-between items-center p-3 rounded-base border-2 ${
                        result.has_solved
                          ? "bg-green-50 border-green-500 dark:bg-green-950"
                          : "bg-red-50 border-red-500 dark:bg-red-950"
                      }`}
                    >
                      <span className="font-medium">{result.username}</span>
                      <span
                        className={`font-semibold ${
                          result.has_solved ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        {result.has_solved ? "✓ Solved" : "✗ Not Solved"}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Users Table */}
        {loading && users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/70">Loading...</p>
          </div>
        ) : users.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-foreground/70">No users added yet. Add a user to get started!</p>
          </Card>
        ) : (
          <Card className="border-2 shadow-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th
                      className="text-left p-4 cursor-pointer hover:bg-muted/80 transition-colors select-none font-heading"
                      onClick={() => sortTable("username")}
                    >
                      Username{getSortIcon("username")}
                    </th>
                    <th
                      className="text-left p-4 cursor-pointer hover:bg-muted/80 transition-colors select-none font-heading"
                      onClick={() => sortTable("total")}
                    >
                      Total{getSortIcon("total")}
                    </th>
                    <th
                      className="text-left p-4 cursor-pointer hover:bg-muted/80 transition-colors select-none font-heading"
                      onClick={() => sortTable("easy")}
                    >
                      Easy{getSortIcon("easy")}
                    </th>
                    <th
                      className="text-left p-4 cursor-pointer hover:bg-muted/80 transition-colors select-none font-heading"
                      onClick={() => sortTable("medium")}
                    >
                      Medium{getSortIcon("medium")}
                    </th>
                    <th
                      className="text-left p-4 cursor-pointer hover:bg-muted/80 transition-colors select-none font-heading"
                      onClick={() => sortTable("hard")}
                    >
                      Hard{getSortIcon("hard")}
                    </th>
                    <th className="text-left p-4 font-heading">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-t-2 hover:bg-muted/50 transition-colors ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/20"
                      }`}
                    >
                      <td className="p-4 font-semibold">{user.username}</td>
                      <td className="p-4 font-bold text-lg">{user.total}</td>
                      <td className="p-4">
                        <span className="inline-block bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-3 py-1 rounded-base border-2 border-green-500 font-semibold">
                          {user.easy}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-block bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-base border-2 border-yellow-500 font-semibold">
                          {user.medium}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-block bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-3 py-1 rounded-base border-2 border-red-500 font-semibold">
                          {user.hard}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="reverse"
                          size="sm"
                          onClick={() => deleteUser(user.username)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
