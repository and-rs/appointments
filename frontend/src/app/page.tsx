"use client";

import AuthCard from "@/components/auth-card";
import axios from "axios";
import useSWR from "swr";

export default function Home() {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data.test);
  const { data, error, isLoading } = useSWR("http://localhost:3001/", fetcher);

  return (
    <main className="flex flex-col p-4 min-h-screen bg-background">
      <div className="flex flex-col gap-4 mx-auto w-full max-w-md h-full">
        <h1 className="my-4 text-3xl font-bold tracking-tight text-center text-foreground">
          Appointments App
        </h1>

        <AuthCard />

        <span className={`font-mono text-sm ${isLoading && "animate-pulse"}`}>
          {isLoading && !data
            ? "Loading..."
            : error
              ? "Connection to backend failed."
              : "Backend is operational."}
        </span>
      </div>
    </main>
  );
}
