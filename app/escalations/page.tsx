import { createClient } from '@/lib/supabase/server';
import { Nav } from '@/components/nav';
import { EscalationsTable } from '@/components/escalations/escalations-table';
import { EscalationsFilters } from '@/components/escalations/escalations-filters';
import type { Escalation, Feedback } from '@/lib/types/database.types';

interface SearchParams {
  team?: string;
  priority?: string;
  status?: string;
}

interface EscalationWithFeedback extends Escalation {
  feedback: Feedback;
}

export default async function EscalationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  // Build query with feedback join
  let query = supabase
    .from('escalations')
    .select('*, feedback(*)')
    .order('priority', { ascending: false }) // Critical first
    .order('created_at', { ascending: true }); // Oldest first within same priority

  // Apply filters
  if (params.team && ['engineering', 'editorial'].includes(params.team)) {
    query = query.eq('team', params.team);
  }

  if (params.priority && ['critical', 'high', 'medium', 'low'].includes(params.priority)) {
    query = query.eq('priority', params.priority);
  }

  if (params.status && ['open', 'closed'].includes(params.status)) {
    query = query.eq('status', params.status);
  } else {
    // Default to showing open escalations only
    query = query.eq('status', 'open');
  }

  const { data: escalations, error } = await query;

  if (error) {
    console.error('Error fetching escalations:', error);
    return <div>Error loading escalations</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Escalations</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage issues escalated to Engineering and Editorial teams
          </p>
        </div>

        <EscalationsFilters />

        <div className="mt-6">
          <EscalationsTable escalations={(escalations as EscalationWithFeedback[]) || []} />
        </div>
      </main>
    </div>
  );
}
