'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function TimeRangeSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get('range') || '30';

  const handleRangeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('range', value);
    router.push(`/metrics?${params.toString()}`);
  };

  return (
    <Select value={currentRange} onValueChange={handleRangeChange}>
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7">Last 7 days</SelectItem>
        <SelectItem value="30">Last 30 days</SelectItem>
        <SelectItem value="90">Last 90 days</SelectItem>
      </SelectContent>
    </Select>
  );
}
