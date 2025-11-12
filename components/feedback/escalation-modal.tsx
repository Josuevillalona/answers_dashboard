'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { Feedback, EscalationTeam, EscalationPriority } from '@/lib/types/database.types';

interface EscalationModalProps {
  feedback: Feedback | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EscalationModal({ feedback, open, onOpenChange }: EscalationModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Team selection
  const [team, setTeam] = useState<EscalationTeam | null>(null);

  // Step 2: Details
  const [priority, setPriority] = useState<EscalationPriority>('medium');
  const [summary, setSummary] = useState('');
  const [details, setDetails] = useState('');
  const [suggestedAction, setSuggestedAction] = useState('');

  if (!feedback) return null;

  const handleClose = () => {
    // Reset form
    setStep(1);
    setTeam(null);
    setPriority('medium');
    setSummary('');
    setDetails('');
    setSuggestedAction('');
    onOpenChange(false);
  };

  const handleNext = () => {
    if (team) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!team || !summary.trim()) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/escalations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback_id: feedback.id,
          team,
          priority,
          summary: summary.trim(),
          details: details.trim() || null,
          suggested_action: suggestedAction.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create escalation');
      }

      toast({
        title: 'Escalation created',
        description: `Issue escalated to ${team === 'engineering' ? 'Engineering' : 'Editorial'} team`,
      });

      router.refresh();
      handleClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create escalation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const summaryCharsRemaining = 100 - summary.length;
  const detailsCharsRemaining = 500 - details.length;
  const actionCharsRemaining = 200 - suggestedAction.length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Escalate to Team</DialogTitle>
          <DialogDescription>
            Step {step} of 2: {step === 1 ? 'Select team' : 'Add escalation details'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            {/* Context Preview */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="mb-2 font-medium text-sm">Escalating feedback:</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">{feedback.query}</p>
            </div>

            {/* Team Selection */}
            <div className="space-y-4">
              <Label className="text-base">Select Team</Label>
              <RadioGroup value={team || ''} onValueChange={(value) => setTeam(value as EscalationTeam)}>
                <div className="space-y-3">
                  <div
                    className={`flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                      team === 'engineering' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setTeam('engineering')}
                  >
                    <RadioGroupItem value="engineering" id="engineering" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="engineering" className="cursor-pointer font-semibold">
                        Engineering Team
                      </Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        For model bugs, hallucinations, wrong context, poor UX, and technical issues
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                      team === 'editorial' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setTeam('editorial')}
                  >
                    <RadioGroupItem value="editorial" id="editorial" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="editorial" className="cursor-pointer font-semibold">
                        Editorial Team
                      </Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        For outdated content, source misinterpretation, and content quality issues
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {/* Context Summary */}
            <div className="rounded-lg border bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Team:</span>
                <span className="capitalize">{team}</span>
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">
                Priority <span className="text-destructive">*</span>
              </Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as EscalationPriority)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span>Critical - Immediate attention needed</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span>High - Should be fixed soon</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span>Medium - Normal priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <span>Low - Minor issue</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary">
                Summary <span className="text-destructive">*</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({summaryCharsRemaining} characters remaining)
                </span>
              </Label>
              <Input
                id="summary"
                placeholder="Brief description of the issue..."
                value={summary}
                onChange={(e) => setSummary(e.target.value.slice(0, 100))}
                maxLength={100}
                required
              />
            </div>

            {/* Details */}
            <div className="space-y-2">
              <Label htmlFor="details">
                Details
                <span className="ml-2 text-xs text-muted-foreground">
                  ({detailsCharsRemaining} characters remaining)
                </span>
              </Label>
              <Textarea
                id="details"
                placeholder="Additional context, reproduction steps, or relevant information..."
                value={details}
                onChange={(e) => setDetails(e.target.value.slice(0, 500))}
                maxLength={500}
                rows={4}
              />
            </div>

            {/* Suggested Action */}
            <div className="space-y-2">
              <Label htmlFor="suggested-action">
                Suggested Action
                <span className="ml-2 text-xs text-muted-foreground">
                  ({actionCharsRemaining} characters remaining)
                </span>
              </Label>
              <Textarea
                id="suggested-action"
                placeholder="Recommended steps to resolve this issue..."
                value={suggestedAction}
                onChange={(e) => setSuggestedAction(e.target.value.slice(0, 200))}
                maxLength={200}
                rows={2}
              />
            </div>

            {/* Auto-included context note */}
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> The original query, answer, sources, PM notes, and tag will be automatically included
                with this escalation.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleNext} disabled={!team}>
                Next
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading || !summary.trim()}>
                {loading ? 'Creating...' : 'Create Escalation'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
