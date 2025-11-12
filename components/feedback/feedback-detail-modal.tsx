'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { EscalationModal } from './escalation-modal';
import type { Feedback, FeedbackTag } from '@/lib/types/database.types';

interface FeedbackDetailModalProps {
  feedback: Feedback | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDetailModal({ feedback, open, onOpenChange }: FeedbackDetailModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [tag, setTag] = useState<FeedbackTag | null>(feedback?.tag || null);
  const [pmNotes, setPmNotes] = useState(feedback?.pm_notes || '');
  const [loading, setLoading] = useState(false);
  const [escalationModalOpen, setEscalationModalOpen] = useState(false);

  // Reset state when feedback changes
  useState(() => {
    if (feedback) {
      setTag(feedback.tag);
      setPmNotes(feedback.pm_notes || '');
    }
  });

  if (!feedback) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/feedback/${feedback.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tag: tag || null,
          pm_notes: pmNotes.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update feedback');
      }

      toast({
        title: 'Feedback updated',
        description: 'Changes saved successfully',
      });

      router.refresh();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async (newStatus: 'closed') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/feedback/${feedback.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          tag: tag || null,
          pm_notes: pmNotes.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to close feedback');
      }

      toast({
        title: 'Feedback closed',
        description: 'This item has been marked as closed',
      });

      router.refresh();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to close feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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

  const remainingChars = 255 - pmNotes.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Feedback Details</DialogTitle>
            <div className="flex items-center gap-2">
              {feedback.rating ? (
                <ThumbsUp className="h-5 w-5 text-green-600" />
              ) : (
                <ThumbsDown className="h-5 w-5 text-red-600" />
              )}
              {getStatusBadge(feedback.status)}
            </div>
          </div>
          <DialogDescription>
            Submitted {format(new Date(feedback.created_at), 'MMM d, yyyy \'at\' h:mm a')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Query */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">User Query</Label>
            <div className="rounded-md border bg-muted/50 p-4">
              <p className="text-sm">{feedback.query}</p>
            </div>
          </div>

          {/* AI Answer */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">AI Answer</Label>
            <div className="rounded-md border bg-muted/50 p-4">
              <p className="text-sm leading-relaxed">{feedback.answer}</p>
            </div>
          </div>

          {/* Sources */}
          {feedback.sources && feedback.sources.length > 0 && (
            <div className="space-y-2">
              <Label className="text-base font-semibold">Sources Cited</Label>
              <div className="space-y-2">
                {feedback.sources.map((source, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-md border bg-muted/50 p-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{source.title}</p>
                      {source.type && (
                        <p className="text-xs text-muted-foreground">{source.type}</p>
                      )}
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Comment */}
          {feedback.user_comment && (
            <div className="space-y-2">
              <Label className="text-base font-semibold">User Comment</Label>
              <div className="rounded-md border bg-muted/50 p-4">
                <p className="text-sm italic">&quot;{feedback.user_comment}&quot;</p>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t" />

          {/* Tag Selection */}
          <div className="space-y-2">
            <Label htmlFor="tag">Issue Tag</Label>
            <Select
              value={tag || 'none'}
              onValueChange={(value) => setTag(value === 'none' ? null : (value as FeedbackTag))}
            >
              <SelectTrigger id="tag">
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No tag</SelectItem>
                <SelectItem value="hallucination">Hallucination</SelectItem>
                <SelectItem value="outdated_content">Outdated Content</SelectItem>
                <SelectItem value="wrong_context">Wrong Context</SelectItem>
                <SelectItem value="poor_ux">Poor UX</SelectItem>
                <SelectItem value="source_misinterpretation">Source Misinterpretation</SelectItem>
                <SelectItem value="correct_answer">Correct Answer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* PM Notes */}
          <div className="space-y-2">
            <Label htmlFor="pm-notes">
              PM Notes
              <span className="ml-2 text-xs text-muted-foreground">
                ({remainingChars} characters remaining)
              </span>
            </Label>
            <Textarea
              id="pm-notes"
              placeholder="Add internal notes about this feedback..."
              value={pmNotes}
              onChange={(e) => setPmNotes(e.target.value.slice(0, 255))}
              rows={3}
              maxLength={255}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          {feedback.status !== 'closed' && (
            <Button variant="secondary" onClick={() => handleClose('closed')} disabled={loading}>
              Close
            </Button>
          )}
          {feedback.status !== 'escalated' && (
            <Button
              variant="secondary"
              onClick={() => setEscalationModalOpen(true)}
              disabled={loading}
            >
              Escalate
            </Button>
          )}
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Escalation Modal */}
      <EscalationModal
        feedback={feedback}
        open={escalationModalOpen}
        onOpenChange={setEscalationModalOpen}
      />
    </Dialog>
  );
}
