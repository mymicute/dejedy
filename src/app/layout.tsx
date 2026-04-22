import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "realmiweb | Modern Real Estate Platform in Nigeria",
  description: "Connect with buyers, renters, and real estate professionals across Nigeria in one unified platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen bg-white dark:bg-black`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Script
            id="orchids-browser-logs"
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
            strategy="afterInteractive"
            data-orchids-project-id="f137162f-56c0-4681-8556-39565026c3ec"
          />
          <ErrorReporter />
            <Script
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
              strategy="afterInteractive"
              data-target-origin="*"
              data-message-type="ROUTE_CHANGE"
              data-include-search-params="true"
              data-only-in-iframe="true"
              data-debug="true"
              data-custom-data='{"appName": "realmiweb", "version": "1.0.0"}'
            />
          <div className="relative flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster position="top-center" richColors />
         
        </ThemeProvider>
      </body>
    </html>
  );
}
