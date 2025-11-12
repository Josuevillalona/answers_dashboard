'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function EscalationsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/escalations?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/escalations');
  };

  const hasActiveFilters = searchParams.toString().length > 0;

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Team Filter */}
        <Select
          value={searchParams.get('team') || 'all'}
          onValueChange={(value) => updateFilter('team', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All teams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All teams</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="editorial">Editorial</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select
          value={searchParams.get('priority') || 'all'}
          onValueChange={(value) => updateFilter('priority', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={searchParams.get('status') || 'open'}
          onValueChange={(value) => updateFilter('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="all">All statuses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
