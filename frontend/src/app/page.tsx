"use client";

import AuthCard from "@/components/auth-card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/axios";
import { Check, X } from "lucide-react";
import useSWR from "swr";

export default function Home() {
  const { data, error, isLoading } = useSWR("/", (url: string) =>
    api.fetch(url),
  );

  return (
    <main className="flex flex-col p-4 min-h-screen bg-background">
      <div className="flex flex-col gap-4 mx-auto w-full max-w-md h-full">
        <h1 className="my-4 text-3xl font-bold tracking-tight text-center text-foreground">
          Appointments App
        </h1>

        <AuthCard />

        <Badge
          variant={"outline"}
          className={`font-mono text-sm [&>svg]:size-4 ${isLoading && "animate-pulse"}`}
        >
          {isLoading && !data ? (
            "Cargando..."
          ) : error ? (
            <>
              Error de conexión con el backend.
              <X />
            </>
          ) : (
            <>
              Backend operativo. <Check />
            </>
          )}
        </Badge>
      </div>
    </main>
  );
}
