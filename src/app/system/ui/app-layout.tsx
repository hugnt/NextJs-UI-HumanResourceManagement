// AppLayout.tsx
"use client";
import { AuthLayout, MainLayout, RegconizationFaceLayout } from "@/components/app-layout";
import { usePathname } from 'next/navigation';
import { ToastContainer } from "react-toastify";


const authPaths = ['/login-admin', '/login-employee'];
const regisFacePath = ['/face-regconition']

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    var layout = authPaths.includes(pathname) ? 0 : 1;
    if (regisFacePath.includes(pathname)) layout = 2;
    return (
        <>
            {layout === 0 && <AuthLayout>{children}</AuthLayout>}
            {layout === 1 && <MainLayout>{children}</MainLayout>}
            {layout === 2 && <RegconizationFaceLayout>{children}</RegconizationFaceLayout>}
            <ToastContainer autoClose={2000} />
        </>
    );
}
