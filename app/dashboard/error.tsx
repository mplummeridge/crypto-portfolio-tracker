"use client"; // Error components must be Client Components

import { MainContainer } from "@/components/layout/main-container";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <MainContainer>
      <div className="text-center py-10 border rounded-lg bg-card text-card-foreground shadow">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Something went wrong!</h2>
        <p className="text-muted-foreground mb-6">
          Could not load the dashboard. ({error.message})
        </p>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </MainContainer>
  );
}
