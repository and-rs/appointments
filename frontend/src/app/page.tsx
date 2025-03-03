"use client";

import AuthCard from "@/components/auth-card";

export default function Home() {
  return (
    <main className="flex flex-col p-4 min-h-screen bg-background">
      <div className="mx-auto w-full max-w-md">
        <div className="mt-4 mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Appointments App
          </h1>
        </div>

        <AuthCard />
      </div>
    </main>
  );
}
