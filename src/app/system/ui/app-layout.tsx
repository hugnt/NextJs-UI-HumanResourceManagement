"use client";

import { AuthLayout, MainLayout } from "@/components/app-layout";
import { usePathname } from 'next/navigation'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Create a client
const queryClient = new QueryClient()
const authPaths =  ['/login','/register'];
export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname= usePathname()
    let layout = 0;
    if(authPaths.includes(pathname)) layout = 0;
    else layout = 1;

    return (
        <QueryClientProvider client={queryClient}>
            {layout == 0 ?<AuthLayout>{children}</AuthLayout>
            :<MainLayout>{children}</MainLayout>}
        </QueryClientProvider>
    );
}