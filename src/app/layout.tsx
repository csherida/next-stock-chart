import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "./components/theme-provider";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js stock chart",
  description: "Example using yahooFinance2",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={cn('h-[99vh] bg-background font-sans antialiased')}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div>
              <div className="relative flex min-h-screen flex-col bg-white">
                <main className="flex-1">{children}</main>
              </div>
            </div>
          </ThemeProvider>
        </body>
    </html>
  );
}
