"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };
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
  data: JSONValue;
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
        data: JSON.stringify({}),
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedRoute = apiRoutes.find((route) => route.route === selectedApi);

  const extractRouteParams = (route: string) => {
    const matches = route.match(/\[([^\]]+)\]/g);
    return matches ? matches.map((match) => match.slice(1, -1)) : [];
  };

  const renderInputFields = () => {
    if (!selectedRoute) return null;

    const routeParams = extractRouteParams(selectedRoute.route);

    return (
      <div className="space-y-6">
        {/* Route Parameters Section */}
        <div className="space-y-4">
          <h4 className="font-heading text-sm text-foreground border-b border-border pb-2">
            Route Parameters
          </h4>
          {routeParams.length > 0 ? (
            <div className="space-y-4">
              {routeParams.map((param) => (
                <div key={param} className="space-y-2">
                  <label
                    className="text-sm font-medium text-foreground"
                    htmlFor={param}
                  >
                    {param} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id={param}
                    placeholder={`Enter ${param}`}
                    value={inputValues[`route_param_${param}`] || ""}
                    onChange={(e) =>
                      handleInputChange(`route_param_${param}`, e.target.value)
                    }
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground/60 py-2">
              No route parameters required
            </p>
          )}
        </div>

        {/* Query Parameters Section */}
        {selectedRoute.filters && selectedRoute.filters.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-heading text-sm text-foreground border-b border-border pb-2">
              Query Parameters (Optional)
            </h4>
            <div className="space-y-4">
              {selectedRoute.filters.map((filter) => (
                <div key={filter.name} className="space-y-2">
                  <label
                    className="text-sm font-medium text-foreground"
                    htmlFor={filter.name}
                  >
                    {filter.name}
                  </label>
                  <Input
                    id={filter.name}
                    placeholder={filter.example}
                    value={inputValues[`filter_${filter.name}`] || ""}
                    onChange={(e) =>
                      handleInputChange(`filter_${filter.name}`, e.target.value)
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    {filter.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Send Button */}
        <div className="pt-4 border-t border-border">
          <Button
            onClick={testApi}
            disabled={loading}
            className="w-full h-12 text-base font-medium"
            size="lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-main-foreground border-t-transparent rounded-full animate-spin"></div>
                Testing...
              </div>
            ) : (
              "Send Request"
            )}
          </Button>
        </div>
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
              <Card className="h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Available APIs</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {apiRoutes.map((route) => (
                      <Button
                        key={route.route}
                        variant={
                          selectedApi === route.route ? "default" : "neutral"
                        }
                        className="w-full justify-start text-left h-auto min-h-[4rem] p-4 group"
                        onClick={() => {
                          setSelectedApi(route.route);
                          setInputValues({});
                          setTestResult(null);
                        }}
                      >
                        <div className="space-y-2 w-full overflow-hidden">
                          <div className="font-mono text-xs break-all leading-tight">
                            {route.route}
                          </div>
                          <div className="text-xs opacity-70 line-clamp-2 leading-relaxed">
                            {route.description}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Input Fields */}
            <div className="lg:col-span-1">
              <Card className="h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">API Configuration</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {selectedApi ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-secondary-background rounded-base border-2 border-border">
                        <p className="text-sm font-mono break-all mb-2">
                          {selectedApi}
                        </p>
                        <p className="text-xs text-foreground/60 leading-relaxed">
                          {selectedRoute?.description}
                        </p>
                      </div>
                      {renderInputFields()}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-foreground/60 mb-2">
                        Select an API to get started
                      </p>
                      <p className="text-xs text-foreground/40">
                        Choose an endpoint from the sidebar to configure and
                        test
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Response Display */}
            <div className="lg:col-span-1">
              <Card className="h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Response</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {testResult ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">Status:</span>
                        <span
                          className={`px-3 py-1 rounded-base text-xs font-mono border-2 font-medium ${
                            testResult.status >= 200 && testResult.status < 300
                              ? "bg-green-50 text-green-800 border-green-300"
                              : "bg-red-50 text-red-800 border-red-300"
                          }`}
                        >
                          {testResult.status}
                        </span>
                      </div>

                      {testResult.error ? (
                        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-base">
                          <p className="text-sm text-red-800 break-words">
                            {testResult.error}
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 bg-secondary-background border-2 border-border rounded-base">
                          <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto max-h-96 break-words">
                            {JSON.stringify(testResult.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-foreground/60 mb-2">
                        Response will appear here
                      </p>
                      <p className="text-xs text-foreground/40">
                        Configure and send a request to see the API response
                      </p>
                    </div>
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
