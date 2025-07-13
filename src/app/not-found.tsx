import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ghost } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="text-center max-w-md shadow-xl border-2 border-dashed">
        <CardContent className="py-10">
          <div className="flex justify-center mb-4">
            <Ghost className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">404 - Page Not Found</h2>
          <p className="text-muted-foreground mb-6">
            Sorry, the page you are looking for does not exist.
          </p>
          <Link href="/">
            <Button variant="default">Go Back Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
