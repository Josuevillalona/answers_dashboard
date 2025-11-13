'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Nav } from '@/components/nav';

export default function MetricsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Metrics page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Error loading metrics</CardTitle>
            </div>
            <CardDescription>
              Unable to load metrics data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm font-mono text-muted-foreground break-words">
                {error.message || 'An unexpected error occurred'}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={reset} className="w-full">
              Try again
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
