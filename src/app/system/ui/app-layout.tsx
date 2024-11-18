// AppLayout.tsx
"use client";
import { AuthLayout, MainLayout, RegconizationFaceLayout } from "@/components/app-layout";
import { usePathname } from 'next/navigation';
import { ToastContainer } from "react-toastify";


const authPaths = ['/login-admin', '/login-employee'];
const regisFacePath = ['/face-regconition']
const publicPath = ['/employee-shared/employee-information/'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    let layout = authPaths.includes(pathname) ? 0 : 1;
    if (regisFacePath.includes(pathname)) layout = 2;
    if (pathname === '/' || publicPath.some(p=>pathname.startsWith(p))) layout=3;
    return (
        <>
            {layout === 0 && <AuthLayout>{children}</AuthLayout>}
            {layout === 1 && <MainLayout>{children}</MainLayout>}
            {layout === 2 && <RegconizationFaceLayout>{children}</RegconizationFaceLayout>}
            {layout === 3 && <>{children}</>}
            <ToastContainer autoClose={2000} />
        </>
    );
}
