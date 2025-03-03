"use client";

import { cn } from "@/lib/utils";
import { Calendar, LogOut, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function Nav() {
  const pathname = usePathname();
  const navigate = useRouter();

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
    <nav className="flex fixed flex-col gap-4 justify-center py-4 px-0 w-full max-w-screen-lg border-b md:flex-row md:justify-around md:p-6 bg-background">
      <h2 className="px-4 text-xl font-bold tracking-tight md:w-1/3">
        Appointments App
      </h2>

      <div className="flex flex-row gap-2 px-4 md:justify-end md:w-2/3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              onClick={() => navigate.push(item.href)}
              key={item.href}
              variant={"ghost"}
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
            navigate.push("/");
            localStorage.removeItem("token");
          }}
          variant={"ghost"}
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
