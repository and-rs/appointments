"use client";

import Nav from "@/components/nav";
import type React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <Nav />

      <div className="flex overflow-hidden flex-col flex-1 py-32 md:py-24">
        <main className="overflow-y-auto flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
