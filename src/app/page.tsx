import HeroSection from "@/components/hero-section";
import StatsExplorer from "@/app/components/stats-explorer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />
      
      <StatsExplorer />

      {/* Feature Highlights Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-heading mb-6 leading-tight">
              <span className="inline-block bg-chart-1 text-main-foreground px-6 py-3 border-2 border-border shadow-shadow transform rotate-1 mr-4">
                Why Use
              </span>
              <br className="sm:hidden" />
              <span className="inline-block transform -rotate-1">CPHUB?</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Track your competitive programming journey, compare with peers, and stay motivated with real-time statistics and rankings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <Card className="group p-8 text-center transform hover:rotate-1 hover:-translate-y-2 transition-all duration-300 border-3 hover:shadow-2xl">
              <div className="bg-chart-1/10 border-2 border-chart-1 rounded-base p-4 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-10 h-10 text-chart-1" />
              </div>
              <h3 className="font-heading text-xl mb-3">Live Rankings</h3>
              <p className="text-base text-foreground/70 leading-relaxed">
                See where you stand among your peers with real-time leaderboards and competitive rankings
              </p>
            </Card>
            
            <Card className="group p-8 text-center transform hover:-rotate-1 hover:-translate-y-2 transition-all duration-300 border-3 hover:shadow-2xl">
              <div className="bg-chart-2/10 border-2 border-chart-2 rounded-base p-4 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-10 h-10 text-chart-2" />
              </div>
              <h3 className="font-heading text-xl mb-3">Track Progress</h3>
              <p className="text-base text-foreground/70 leading-relaxed">
                Monitor your problem-solving journey across multiple platforms with detailed statistics
              </p>
            </Card>
            
            <Card className="group p-8 text-center transform hover:rotate-1 hover:-translate-y-2 transition-all duration-300 border-3 hover:shadow-2xl">
              <div className="bg-chart-3/10 border-2 border-chart-3 rounded-base p-4 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-chart-3" />
              </div>
              <h3 className="font-heading text-xl mb-3">Community Driven</h3>
              <p className="text-base text-foreground/70 leading-relaxed">
                Compare with friends, see who solved what, and grow together as a community
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
