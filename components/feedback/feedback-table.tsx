'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { FeedbackDetailModal } from './feedback-detail-modal';
import type { Feedback } from '@/lib/types/database.types';

interface FeedbackTableProps {
  feedback: Feedback[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function FeedbackTable({ feedback, currentPage, totalPages, totalCount }: FeedbackTableProps) {
  const router = useRouter();
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRowClick = (item: Feedback) => {
    setSelectedFeedback(item);
    setModalOpen(true);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    router.push(`/feedback?${params.toString()}`);
  };

  const truncate = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      open: 'outline',
      escalated: 'destructive',
      closed: 'secondary',
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTagBadge = (tag: string | null) => {
    if (!tag) return null;
    const tagLabels: Record<string, string> = {
      hallucination: 'Hallucination',
      outdated_content: 'Outdated Content',
      wrong_context: 'Wrong Context',
      poor_ux: 'Poor UX',
      source_misinterpretation: 'Source Misinterpretation',
      correct_answer: 'Correct Answer',
    };
    return <Badge variant="outline">{tagLabels[tag] || tag}</Badge>;
  };

  if (feedback.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">No feedback found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Query</TableHead>
              <TableHead>User Comment</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedback.map((item) => (
              <TableRow
                key={item.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(item)}
              >
                <TableCell>
                  {item.rating ? (
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <ThumbsDown className="h-4 w-4 text-red-600" />
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {truncate(item.query, 80)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.user_comment ? truncate(item.user_comment, 60) : (
                    <span className="italic">No comment</span>
                  )}
                </TableCell>
                <TableCell>{getTagBadge(item.tag)}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(item.created_at), 'MMM d, yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{(currentPage - 1) * 50 + 1}</span> to{' '}
          <span className="font-medium">{Math.min(currentPage * 50, totalCount)}</span> of{' '}
          <span className="font-medium">{totalCount}</span> results
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Detail Modal */}
      <FeedbackDetailModal
        feedback={selectedFeedback}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
