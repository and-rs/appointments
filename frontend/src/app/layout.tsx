import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Golos_Text, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Golos_Text({
  weight: "variable",
  variable: "--font-sans",
  subsets: ["latin-ext"],
});

const fontMono = JetBrains_Mono({
  weight: "variable",
  variable: "--font-mono",
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Appointments App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(fontSans.variable, fontMono.variable, "antialiased")}
    >
      <body>
        <main className="mx-auto max-w-screen-lg ring min-h-fit ring-border">
          {children}
        </main>
      </body>
    </html>
  );
}
