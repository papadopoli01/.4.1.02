'use client';

import { ReactNode, useState } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster theme="dark" position="bottom-right" />
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
