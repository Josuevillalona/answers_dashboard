'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Feedback', href: '/feedback' },
  { name: 'Escalations', href: '/escalations' },
  { name: 'Metrics', href: '/metrics' },
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <h1 className="text-xl font-bold">O&apos;Reilly QA Dashboard</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                    pathname?.startsWith(item.href)
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
