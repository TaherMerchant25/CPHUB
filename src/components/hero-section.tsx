"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const apiEndpoints = [
  { label: "LeetCode", url: "/api/leetcode" },
  { label: "Codeforces", url: "/api/codeforces" },
  { label: "CodeChef", url: "/api/codechef" },
];

const HeroSection = () => {
  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("API copied to clipboard!");
  };

  return (
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-10">
      {/* Floating shapes for neobrutalism effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-main border-2 border-border rounded-base shadow-shadow rotate-12 opacity-20"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-chart-2 border-2 border-border rounded-base shadow-shadow -rotate-12 opacity-20"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-chart-3 border-2 border-border rounded-base shadow-shadow rotate-45 opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-chart-4 border-2 border-border rounded-base shadow-shadow -rotate-45 opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Main heading */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading leading-tight">
            <span className="inline-block transform -rotate-1">Unified</span>{" "}
            <span className="inline-block bg-main text-main-foreground px-4 py-2 border-2 border-border shadow-shadow transform rotate-1">
              Competitive
            </span>
            <br />
            <span className="inline-block transform rotate-1">
              Programming
            </span>{" "}
            <span className="inline-block bg-chart-1 text-main-foreground px-4 py-2 border-2 border-border shadow-shadow transform -rotate-1">
              Hub
            </span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto font-base">
            CPHUB is a competitive programming statistics website that lets you
            explore profiles, contests, problems, and activity across LeetCode,
            Codeforces, and CodeChef with a beautiful, unified interface.
          </p>
        </div>

        {/* CTA Buttons and API endpoints */}
        <div className="grid gap-4 pt-6">
          {apiEndpoints.map((api) => (
            <div
              key={api.label}
              className="flex items-center justify-between rounded-xl border bg-muted px-4 py-3 shadow-sm"
            >
              <span className="text-sm md:text-base font-mono truncate">
                {api.url}
              </span>
              <Button size="sm" onClick={() => handleCopy(api.url)}>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
