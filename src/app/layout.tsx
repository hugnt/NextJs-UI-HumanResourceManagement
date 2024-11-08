/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/app/system/ui/app-layout";
import AppContext from "@/app/system/ui/app-context";
import { AuthProvider } from "./system/ui/auth-context";

export const metadata: Metadata = {
  title: "myHRM",
  description: "Created by .NET Developers",
};



export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" suppressHydrationWarning={true} >
      <body className={``}>
        <AppContext>
          <AuthProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </AuthProvider>
        </AppContext>
      </body>
    </html>
  );
}
