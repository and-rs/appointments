"use client";

import ApiClient from "@/lib/axios";
import { AuthResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Calendar, Loader2Icon, LogOut, Plus, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  const { data, error, isLoading } = useSWR("/users/authorized", (url) =>
    ApiClient.fetch<AuthResponse>(url, { requiresAuth: true }),
  );

  const navItems = [
    {
      name: "Ver Citas",
      href: "/dashboard",
      icon: Calendar,
    },
    {
      name: "Crear Cita",
      href: "/dashboard/create",
      icon: Plus,
    },
  ];

  return (
    <nav className="flex fixed z-50 flex-col gap-4 justify-center p-4 w-full max-w-screen-lg border-b md:flex-row md:justify-between md:p-6 bg-background">
      <div className="flex gap-2 p-1 pl-2 rounded-xl border sm:gap-4 w-fit">
        <h2 className="self-center mb-1 font-bold tracking-tight sm:text-xl text-md">
          Appointments App
        </h2>
        <Badge
          variant={"outline"}
          className="self-center p-1 px-2 h-8 text-xs sm:text-sm"
        >
          {error ? null : isLoading ? (
            <Loader2Icon className="self-center animate-spin size-5" />
          ) : (
            <>
              <User />
              <span>{data && data.result.user.name}</span>
            </>
          )}
        </Badge>
      </div>

      <div className="flex flex-row gap-2 p-1 rounded-xl border md:justify-end w-fit">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              onClick={() => router.push(item.href)}
              key={item.href}
              variant={"outline"}
              size={"sm"}
              className={cn(
                "text-xs sm:text-sm rounded-md transition-colors self-center p-2",
                isActive && "bg-primary text-primary-foreground",
              )}
            >
              <item.icon className="hidden sm:block" />
              {item.name}
            </Button>
          );
        })}

        <Button
          onClick={() => {
            router.push("/");
            localStorage.removeItem("token");
          }}
          variant={"outline"}
          size={"sm"}
          className="self-center p-2 text-xs rounded-md transition-colors sm:text-sm"
        >
          <LogOut className="hidden sm:block" />
          Cerrar Sesión
        </Button>
      </div>
    </nav>
  );
}
