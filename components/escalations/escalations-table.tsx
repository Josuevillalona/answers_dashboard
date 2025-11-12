'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { EscalationDetailModal } from './escalation-detail-modal';
import type { Escalation, Feedback } from '@/lib/types/database.types';

interface EscalationWithFeedback extends Escalation {
  feedback: Feedback;
}

interface EscalationsTableProps {
  escalations: EscalationWithFeedback[];
}

export function EscalationsTable({ escalations }: EscalationsTableProps) {
  const [selectedEscalation, setSelectedEscalation] = useState<EscalationWithFeedback | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRowClick = (escalation: EscalationWithFeedback) => {
    setSelectedEscalation(escalation);
    setModalOpen(true);
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
      critical: { variant: 'destructive', icon: <AlertCircle className="mr-1 h-3 w-3" /> },
      high: { variant: 'destructive', icon: <AlertCircle className="mr-1 h-3 w-3" /> },
      medium: { variant: 'secondary', icon: <AlertCircle className="mr-1 h-3 w-3" /> },
      low: { variant: 'outline', icon: <AlertCircle className="mr-1 h-3 w-3" /> },
    };

    const { variant, icon } = config[priority] || config.medium;

    return (
      <Badge variant={variant} className="flex w-fit items-center">
        {icon}
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getTeamBadge = (team: string) => {
    const colors: Record<string, string> = {
      engineering: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      editorial: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    };

    return (
      <Badge variant="outline" className={colors[team]}>
        {team.charAt(0).toUpperCase() + team.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'open' ? 'default' : 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTagBadge = (tag: string | null) => {
    if (!tag) return <span className="text-muted-foreground italic">No tag</span>;
    const tagLabels: Record<string, string> = {
      hallucination: 'Hallucination',
      outdated_content: 'Outdated Content',
      wrong_context: 'Wrong Context',
      poor_ux: 'Poor UX',
      source_misinterpretation: 'Source Misinterpretation',
      correct_answer: 'Correct Answer',
    };
    return <span className="text-sm">{tagLabels[tag] || tag}</span>;
  };

  const truncate = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  if (escalations.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">
          No escalations found. Try adjusting your filters or create a new escalation from the feedback page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Priority</TableHead>
              <TableHead className="w-32">Team</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Issue Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {escalations.map((escalation) => (
              <TableRow
                key={escalation.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(escalation)}
              >
                <TableCell>{getPriorityBadge(escalation.priority)}</TableCell>
                <TableCell>{getTeamBadge(escalation.team)}</TableCell>
                <TableCell className="font-medium">
                  {truncate(escalation.summary, 60)}
                </TableCell>
                <TableCell>{getTagBadge(escalation.feedback.tag)}</TableCell>
                <TableCell>{getStatusBadge(escalation.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(escalation.created_at), 'MMM d, yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing <span className="font-medium">{escalations.length}</span> escalation
          {escalations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Detail Modal */}
      <EscalationDetailModal
        escalation={selectedEscalation}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
