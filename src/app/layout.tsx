/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/app/system/ui/app-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "myHRM",
  description: "Created by .NET Developers",
};



export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" suppressHydrationWarning={true} >
      <body className={``}>
        <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
          <AppLayout> 
              {children}
          </AppLayout>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
