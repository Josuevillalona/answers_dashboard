'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function FeedbackFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset to page 1 when filtering
    router.push(`/feedback?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('search', search);
  };

  const clearFilters = () => {
    setSearch('');
    router.push('/feedback');
  };

  const hasActiveFilters = searchParams.toString().length > 0;

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="sm:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search queries and comments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </form>

        {/* Rating Filter */}
        <Select
          value={searchParams.get('rating') || 'all'}
          onValueChange={(value) => updateFilter('rating', value === 'all' ? '' : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All ratings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ratings</SelectItem>
            <SelectItem value="up">👍 Thumbs up</SelectItem>
            <SelectItem value="down">👎 Thumbs down</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={searchParams.get('status') || 'all'}
          onValueChange={(value) => updateFilter('status', value === 'all' ? '' : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
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
