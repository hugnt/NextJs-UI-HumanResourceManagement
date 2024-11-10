// AppLayout.tsx
"use client";
import { AuthLayout, MainLayout } from "@/components/app-layout";
import { usePathname } from 'next/navigation';
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./auth-context";


const authPaths = ['/login', '/register'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const layout = authPaths.includes(pathname) ? 0 : 1;

    return (
        <>
            {layout === 0 ? <AuthLayout>{children}</AuthLayout>
                : <MainLayout>{children}</MainLayout>}
            <ToastContainer autoClose={2000} /></>
    );
}
