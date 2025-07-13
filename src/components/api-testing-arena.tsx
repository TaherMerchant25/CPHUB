"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ApiRoute {
  route: string;
  description: string;
  filters?: Array<{
    name: string;
    description: string;
    example: string;
  }>;
}

interface ApiResponse {
  status: number;
  supportedRoutes: ApiRoute[];
}

interface ApiTestResult {
  status: number;
  data: any;
  error?: string;
}

const APITestingArena = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("codechef");
  const [selectedApi, setSelectedApi] = useState<string>("");
  const [apiRoutes, setApiRoutes] = useState<ApiRoute[]>([]);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [testResult, setTestResult] = useState<ApiTestResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch API routes for selected platform
  React.useEffect(() => {
    const fetchApiRoutes = async () => {
      try {
        const response = await fetch(`/api/${selectedPlatform}`);
        const data: ApiResponse = await response.json();
        setApiRoutes(data.supportedRoutes);
        setSelectedApi("");
        setInputValues({});
        setTestResult(null);
      } catch (error) {
        console.error("Failed to fetch API routes:", error);
      }
    };

    fetchApiRoutes();
  }, [selectedPlatform]);

  const handleInputChange = (key: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const buildApiUrl = (route: string) => {
    let url = route;
    
    // Replace route parameters with input values
    Object.entries(inputValues).forEach(([key, value]) => {
      if (key.startsWith("route_param_")) {
        const paramName = key.replace("route_param_", "");
        url = url.replace(`[${paramName}]`, value);
      }
    });

    // Add query parameters
    const queryParams = Object.entries(inputValues)
      .filter(([key]) => key.startsWith("filter_"))
      .map(([key, value]) => {
        const filterName = key.replace("filter_", "");
        return `${filterName}=${encodeURIComponent(value)}`;
      })
      .join("&");

    if (queryParams) {
      url += `?${queryParams}`;
    }

    return url;
  };

  const testApi = async () => {
    if (!selectedApi) return;

    setLoading(true);
    try {
      const url = buildApiUrl(selectedApi);
      const response = await fetch(url);
      const data = await response.json();
      
      setTestResult({
        status: response.status,
        data,
      });
    } catch (error) {
      setTestResult({
        status: 500,
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedRoute = apiRoutes.find(route => route.route === selectedApi);

  const extractRouteParams = (route: string) => {
    const matches = route.match(/\[([^\]]+)\]/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  };

  const renderInputFields = () => {
    if (!selectedRoute) return null;

    const routeParams = extractRouteParams(selectedRoute.route);
    
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <h4 className="font-heading text-sm">Route Parameters</h4>
          {routeParams.length > 0 ? (
            routeParams.map((param) => (
              <div key={param} className="space-y-1">
                <label className="text-sm font-medium" htmlFor={param}>
                  {param}
                </label>
                <Input
                  id={param}
                  placeholder={`Enter ${param}`}
                  value={inputValues[`route_param_${param}`] || ""}
                  onChange={(e) => handleInputChange(`route_param_${param}`, e.target.value)}
                />
              </div>
            ))
          ) : (
            <p className="text-sm text-foreground/60">No route parameters required</p>
          )}
        </div>

        {selectedRoute.filters && selectedRoute.filters.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-heading text-sm">Query Parameters (Optional)</h4>
            {selectedRoute.filters.map((filter) => (
              <div key={filter.name} className="space-y-1">
                <label className="text-sm font-medium" htmlFor={filter.name}>
                  {filter.name}
                </label>
                <Input
                  id={filter.name}
                  placeholder={filter.example}
                  value={inputValues[`filter_${filter.name}`] || ""}
                  onChange={(e) => handleInputChange(`filter_${filter.name}`, e.target.value)}
                />
                <p className="text-xs text-foreground/60">{filter.description}</p>
              </div>
            ))}
          </div>
        )}

        <Button onClick={testApi} disabled={loading} className="w-full">
          {loading ? "Testing..." : "Send Request"}
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full">
      <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="codechef">CodeChef</TabsTrigger>
          <TabsTrigger value="codeforces">Codeforces</TabsTrigger>
          <TabsTrigger value="leetcode">LeetCode</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPlatform} className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* API Routes Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Available APIs</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {apiRoutes.map((route) => (
                      <Button
                        key={route.route}
                        variant={selectedApi === route.route ? "default" : "neutral"}
                        className="w-full justify-start text-left h-auto p-3"
                        onClick={() => {
                          setSelectedApi(route.route);
                          setInputValues({});
                          setTestResult(null);
                        }}
                      >
                        <div className="space-y-1">
                          <div className="font-mono text-xs">{route.route}</div>
                          <div className="text-xs opacity-70">{route.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Input Fields */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">API Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedApi ? (
                    <div className="space-y-4">
                      <div className="p-3 bg-secondary-background rounded-base border-2 border-border">
                        <p className="text-sm font-mono">{selectedApi}</p>
                        <p className="text-xs text-foreground/60 mt-1">
                          {selectedRoute?.description}
                        </p>
                      </div>
                      {renderInputFields()}
                    </div>
                  ) : (
                    <p className="text-foreground/60">Select an API from the sidebar to get started</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Response Display */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Response</CardTitle>
                </CardHeader>
                <CardContent>
                  {testResult ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Status:</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-mono ${
                            testResult.status >= 200 && testResult.status < 300
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : "bg-red-100 text-red-800 border border-red-300"
                          }`}
                        >
                          {testResult.status}
                        </span>
                      </div>
                      
                      {testResult.error ? (
                        <div className="p-3 bg-red-50 border-2 border-red-300 rounded-base">
                          <p className="text-sm text-red-800">{testResult.error}</p>
                        </div>
                      ) : (
                        <div className="p-3 bg-secondary-background border-2 border-border rounded-base">
                          <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto max-h-96">
                            {JSON.stringify(testResult.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-foreground/60">
                      Configure and send a request to see the response here
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APITestingArena;
