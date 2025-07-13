import HeroSection from "@/components/hero-section";
import APITestingArena from "@/components/api-testing-arena";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Zap, Code } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />
      
      {/* API Testing Arena Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          
          <Card className="shadow-2xl border-4">
            <CardHeader>
              <CardTitle className="text-2xl font-heading text-center"> 
            <h2 className="text-3xl md:text-4xl font-heading mb-4">
              <span className="inline-block bg-main text-main-foreground px-4 py-2 border-2 border-border shadow-shadow transform -rotate-1">
                API
              </span>{" "}
              <span className="inline-block transform rotate-1">Testing Arena</span>
            </h2> 
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <APITestingArena />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-heading mb-6 leading-tight">
              <span className="inline-block bg-chart-1 text-main-foreground px-6 py-3 border-2 border-border shadow-shadow transform rotate-1 mr-4">
                Why Choose
              </span>
              <br className="sm:hidden" />
              <span className="inline-block transform -rotate-1">Our APIs?</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Built with developers in mind, our APIs provide reliable and efficient access to competitive programming data across multiple platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <Card className="group p-8 text-center transform hover:rotate-1 hover:-translate-y-2 transition-all duration-300 border-3 hover:shadow-2xl">
              <div className="bg-chart-1/10 border-2 border-chart-1 rounded-base p-4 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Database className="w-10 h-10 text-chart-1" />
              </div>
              <h3 className="font-heading text-xl mb-3">Multi-Platform</h3>
              <p className="text-base text-foreground/70 leading-relaxed">
                Unified APIs for CodeChef, Codeforces, and LeetCode with consistent data formats
              </p>
            </Card>
            
            <Card className="group p-8 text-center transform hover:-rotate-1 hover:-translate-y-2 transition-all duration-300 border-3 hover:shadow-2xl">
              <div className="bg-chart-2/10 border-2 border-chart-2 rounded-base p-4 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-10 h-10 text-chart-2" />
              </div>
              <h3 className="font-heading text-xl mb-3">Real-time Testing</h3>
              <p className="text-base text-foreground/70 leading-relaxed">
                Interactive API playground with live responses and instant feedback
              </p>
            </Card>
            
            <Card className="group p-8 text-center transform hover:rotate-1 hover:-translate-y-2 transition-all duration-300 border-3 hover:shadow-2xl">
              <div className="bg-chart-3/10 border-2 border-chart-3 rounded-base p-4 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Code className="w-10 h-10 text-chart-3" />
              </div>
              <h3 className="font-heading text-xl mb-3">Developer Friendly</h3>
              <p className="text-base text-foreground/70 leading-relaxed">
                Clean documentation, easy integration, and comprehensive examples
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
