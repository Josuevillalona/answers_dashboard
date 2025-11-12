'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { Escalation, Feedback } from '@/lib/types/database.types';

interface EscalationWithFeedback extends Escalation {
  feedback: Feedback;
}

interface EscalationDetailModalProps {
  escalation: EscalationWithFeedback | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EscalationDetailModal({ escalation, open, onOpenChange }: EscalationDetailModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolutionInput, setShowResolutionInput] = useState(false);

  if (!escalation) return null;

  const handleClose = async () => {
    if (!resolutionNotes.trim() && showResolutionInput) {
      toast({
        title: 'Resolution notes required',
        description: 'Please add notes before closing the escalation',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/escalations/${escalation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'closed',
          resolution_notes: resolutionNotes.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to close escalation');
      }

      toast({
        title: 'Escalation closed',
        description: 'This escalation has been marked as closed',
      });

      router.refresh();
      onOpenChange(false);
      setShowResolutionInput(false);
      setResolutionNotes('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to close escalation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReopen = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/escalations/${escalation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'open',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reopen escalation');
      }

      toast({
        title: 'Escalation reopened',
        description: 'This escalation has been reopened',
      });

      router.refresh();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reopen escalation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
      critical: { variant: 'destructive', color: 'text-red-600' },
      high: { variant: 'destructive', color: 'text-orange-600' },
      medium: { variant: 'secondary', color: 'text-yellow-600' },
      low: { variant: 'outline', color: 'text-blue-600' },
    };

    const { variant, color } = config[priority] || config.medium;

    return (
      <Badge variant={variant} className="flex w-fit items-center">
        <AlertCircle className={`mr-1 h-3 w-3 ${color}`} />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Escalation Details</DialogTitle>
            <div className="flex items-center gap-2">
              {getPriorityBadge(escalation.priority)}
              <Badge variant="outline" className="capitalize">
                {escalation.team}
              </Badge>
              <Badge variant={escalation.status === 'open' ? 'default' : 'secondary'}>
                {escalation.status.charAt(0).toUpperCase() + escalation.status.slice(1)}
              </Badge>
            </div>
          </div>
          <DialogDescription>
            Escalated {format(new Date(escalation.created_at), 'MMM d, yyyy \'at\' h:mm a')}
            {escalation.resolved_at && (
              <> • Resolved {format(new Date(escalation.resolved_at), 'MMM d, yyyy')}</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Escalation Info */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Summary</Label>
              <p className="text-sm font-medium mt-1">{escalation.summary}</p>
            </div>
            {escalation.details && (
              <div>
                <Label className="text-xs text-muted-foreground">Details</Label>
                <p className="text-sm mt-1">{escalation.details}</p>
              </div>
            )}
            {escalation.suggested_action && (
              <div>
                <Label className="text-xs text-muted-foreground">Suggested Action</Label>
                <p className="text-sm mt-1">{escalation.suggested_action}</p>
              </div>
            )}
          </div>

          {/* Resolution Notes */}
          {escalation.resolution_notes && (
            <div className="rounded-lg border bg-green-50 dark:bg-green-950 p-4">
              <Label className="text-xs text-green-800 dark:text-green-200">Resolution Notes</Label>
              <p className="text-sm mt-1">{escalation.resolution_notes}</p>
            </div>
          )}

          <div className="border-t" />

          {/* Original Feedback Context */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              Original Feedback
              {escalation.feedback.rating ? (
                <ThumbsUp className="h-4 w-4 text-green-600" />
              ) : (
                <ThumbsDown className="h-4 w-4 text-red-600" />
              )}
            </h3>

            <div className="space-y-4">
              {/* User Query */}
              <div>
                <Label className="text-sm font-medium">User Query</Label>
                <div className="rounded-md border bg-muted/50 p-3 mt-1">
                  <p className="text-sm">{escalation.feedback.query}</p>
                </div>
              </div>

              {/* AI Answer */}
              <div>
                <Label className="text-sm font-medium">AI Answer</Label>
                <div className="rounded-md border bg-muted/50 p-3 mt-1">
                  <p className="text-sm leading-relaxed">{escalation.feedback.answer}</p>
                </div>
              </div>

              {/* Sources */}
              {escalation.feedback.sources && escalation.feedback.sources.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Sources Cited</Label>
                  <div className="space-y-2 mt-1">
                    {escalation.feedback.sources.map((source, index) => (
                      <div key={index} className="flex items-center gap-2 rounded-md border bg-muted/50 p-2 text-xs">
                        <div className="flex-1">
                          <p className="font-medium">{source.title}</p>
                        </div>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User Comment */}
              {escalation.feedback.user_comment && (
                <div>
                  <Label className="text-sm font-medium">User Comment</Label>
                  <div className="rounded-md border bg-muted/50 p-3 mt-1">
                    <p className="text-sm italic">&quot;{escalation.feedback.user_comment}&quot;</p>
                  </div>
                </div>
              )}

              {/* PM Notes */}
              {escalation.feedback.pm_notes && (
                <div>
                  <Label className="text-sm font-medium">PM Notes</Label>
                  <div className="rounded-md border bg-muted/50 p-3 mt-1">
                    <p className="text-sm">{escalation.feedback.pm_notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resolution Notes Input (when closing) */}
          {showResolutionInput && escalation.status === 'open' && (
            <div className="space-y-2">
              <Label htmlFor="resolution">
                Resolution Notes <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="resolution"
                placeholder="Describe how this issue was resolved..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Close
          </Button>
          {escalation.status === 'open' && !showResolutionInput && (
            <Button
              onClick={() => setShowResolutionInput(true)}
              disabled={loading}
            >
              Mark as Closed
            </Button>
          )}
          {showResolutionInput && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setShowResolutionInput(false);
                  setResolutionNotes('');
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleClose} disabled={loading}>
                {loading ? 'Closing...' : 'Confirm Close'}
              </Button>
            </>
          )}
          {escalation.status === 'closed' && (
            <Button onClick={handleReopen} disabled={loading}>
              {loading ? 'Reopening...' : 'Reopen Escalation'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
