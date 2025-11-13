import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import { Nav } from '@/components/nav';
import { FeedbackTable } from '@/components/feedback/feedback-table';
import { FeedbackFilters } from '@/components/feedback/feedback-filters';
import { EmptyState } from '@/components/ui/empty-state';
import { MessageSquare } from 'lucide-react';
import type { Feedback } from '@/lib/types/database.types';

interface SearchParams {
  rating?: string;
  status?: string;
  search?: string;
  page?: string;
}

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAuth(); // Protect this page
  const params = await searchParams;
  const supabase = await createClient();

  // Build query
  let query = supabase
    .from('feedback')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  // Apply filters
  if (params.rating === 'up') {
    query = query.eq('rating', true);
  } else if (params.rating === 'down') {
    query = query.eq('rating', false);
  }

  if (params.status) {
    query = query.eq('status', params.status);
  }

  if (params.search) {
    query = query.or(`query.ilike.%${params.search}%,user_comment.ilike.%${params.search}%`);
  }

  // Pagination
  const page = parseInt(params.page || '1');
  const pageSize = 50;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.range(from, to);

  const { data: feedback, error, count } = await query;

  if (error) {
    console.error('Error fetching feedback:', error);
    return <div>Error loading feedback</div>;
  }

  const totalPages = Math.ceil((count || 0) / pageSize);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Feedback</h1>
          <p className="mt-2 text-muted-foreground">
            Review and triage user feedback on AI-generated answers
          </p>
        </div>

        <FeedbackFilters />

        <div className="mt-6">
          {!feedback || feedback.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No feedback found"
              description={
                params.search || params.rating || params.status
                  ? "No feedback matches your current filters. Try adjusting or clearing the filters."
                  : "There is no feedback data available yet."
              }
            />
          ) : (
            <FeedbackTable
              feedback={(feedback as Feedback[]) || []}
              currentPage={page}
              totalPages={totalPages}
              totalCount={count || 0}
            />
          )}
        </div>
      </main>
    </div>
  );
}
