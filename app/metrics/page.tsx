import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import { Nav } from '@/components/nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TimeRangeSelector } from '@/components/metrics/time-range-selector';

interface SearchParams {
  range?: string;
}

export default async function MetricsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAuth(); // Protect this page
  const params = await searchParams;
  const supabase = await createClient();

  // Calculate date range
  const range = params.range || '30';
  const daysAgo = parseInt(range);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysAgo);

  // Fetch all feedback in range
  const { data: allFeedback, error: feedbackError } = await supabase
    .from('feedback')
    .select('*')
    .gte('created_at', startDate.toISOString());

  // Fetch all escalations in range
  const { data: allEscalations, error: escalationsError } = await supabase
    .from('escalations')
    .select('*')
    .gte('created_at', startDate.toISOString());

  if (feedbackError || escalationsError) {
    console.error('Error fetching metrics:', feedbackError || escalationsError);
    return <div>Error loading metrics</div>;
  }

  // Calculate metrics
  const totalFeedback = allFeedback?.length || 0;
  const thumbsDown = allFeedback?.filter(f => !f.rating).length || 0;
  const thumbsDownRate = totalFeedback > 0 ? ((thumbsDown / totalFeedback) * 100).toFixed(1) : '0.0';

  // Issues by category
  const issuesByTag: Record<string, number> = {};
  allFeedback?.forEach(f => {
    if (f.tag) {
      issuesByTag[f.tag] = (issuesByTag[f.tag] || 0) + 1;
    }
  });

  // Status breakdown
  const statusCounts = {
    open: allFeedback?.filter(f => f.status === 'open').length || 0,
    escalated: allFeedback?.filter(f => f.status === 'escalated').length || 0,
    closed: allFeedback?.filter(f => f.status === 'closed').length || 0,
  };

  // Escalations by team
  const escalationsByTeam = {
    engineering: allEscalations?.filter(e => e.team === 'engineering').length || 0,
    editorial: allEscalations?.filter(e => e.team === 'editorial').length || 0,
  };

  // Escalations by priority
  const escalationsByPriority = {
    critical: allEscalations?.filter(e => e.priority === 'critical').length || 0,
    high: allEscalations?.filter(e => e.priority === 'high').length || 0,
    medium: allEscalations?.filter(e => e.priority === 'medium').length || 0,
    low: allEscalations?.filter(e => e.priority === 'low').length || 0,
  };

  // Calculate average resolution time
  const resolvedEscalations = allEscalations?.filter(e => e.resolved_at) || [];
  const avgResolutionTime = resolvedEscalations.length > 0
    ? resolvedEscalations.reduce((sum, e) => {
        const created = new Date(e.created_at).getTime();
        const resolved = new Date(e.resolved_at!).getTime();
        const days = (resolved - created) / (1000 * 60 * 60 * 24);
        return sum + days;
      }, 0) / resolvedEscalations.length
    : 0;

  const tagLabels: Record<string, string> = {
    hallucination: 'Hallucination',
    outdated_content: 'Outdated Content',
    wrong_context: 'Wrong Context',
    poor_ux: 'Poor UX',
    source_misinterpretation: 'Source Misinterpretation',
    correct_answer: 'Correct Answer',
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Metrics</h1>
            <p className="mt-2 text-muted-foreground">
              Key performance indicators and quality metrics
            </p>
          </div>
          <TimeRangeSelector />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Feedback */}
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Feedback</CardDescription>
              <CardTitle className="text-4xl">{totalFeedback}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Last {daysAgo} days
              </div>
            </CardContent>
          </Card>

          {/* Thumbs Down Rate */}
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Thumbs Down Rate</CardDescription>
              <CardTitle className="text-4xl">{thumbsDownRate}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {thumbsDown} of {totalFeedback} negative
              </div>
            </CardContent>
          </Card>

          {/* Open Escalations */}
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Open Escalations</CardDescription>
              <CardTitle className="text-4xl">
                {allEscalations?.filter(e => e.status === 'open').length || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {allEscalations?.filter(e => e.status === 'closed').length || 0} resolved
              </div>
            </CardContent>
          </Card>

          {/* Avg Resolution Time */}
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Resolution Time</CardDescription>
              <CardTitle className="text-4xl">
                {avgResolutionTime.toFixed(1)}d
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {resolvedEscalations.length} resolved
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Issues by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Issues by Category</CardTitle>
              <CardDescription>Distribution of feedback tags</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(issuesByTag).length > 0 ? (
                    Object.entries(issuesByTag)
                      .sort(([, a], [, b]) => b - a)
                      .map(([tag, count]) => (
                        <TableRow key={tag}>
                          <TableCell className="font-medium">
                            {tagLabels[tag] || tag}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">{count}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">
                        No tagged issues in this period
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Feedback Status */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback Status</CardTitle>
              <CardDescription>Current status distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Open</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{statusCounts.open}</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Escalated</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">{statusCounts.escalated}</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Closed</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{statusCounts.closed}</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Escalations by Team */}
          <Card>
            <CardHeader>
              <CardTitle>Escalations by Team</CardTitle>
              <CardDescription>Distribution across teams</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Engineering</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{escalationsByTeam.engineering}</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Editorial</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{escalationsByTeam.editorial}</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Escalations by Priority */}
          <Card>
            <CardHeader>
              <CardTitle>Escalations by Priority</CardTitle>
              <CardDescription>Priority distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Critical</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">{escalationsByPriority.critical}</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">High</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">{escalationsByPriority.high}</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Medium</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{escalationsByPriority.medium}</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Low</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{escalationsByPriority.low}</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </main>
    </div>
  );
}
