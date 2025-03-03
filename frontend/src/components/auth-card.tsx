"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Login from "./login";
import SignIn from "./signin";

export default function AuthCard() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Bienvenido</CardTitle>
        <CardDescription className="text-center">
          Inicia sesión o crea una cuenta para continuar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex overflow-hidden mb-6 w-full rounded-md border">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${
                activeTab === "login"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Iniciar Sesión
            </button>

            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${
                activeTab === "register"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Registrarse
            </button>
          </div>

          <div
            className={`w-full transition-opacity duration-200 top-0 left-0 ${
              activeTab === "login"
                ? "opacity-100 z-10"
                : "opacity-0 z-0 hidden"
            }`}
          >
            <Login />
          </div>

          <div
            className={`w-full transition-opacity duration-200 top-0 left-0 ${
              activeTab === "register"
                ? "opacity-100 z-10"
                : "opacity-0 z-0 hidden"
            }`}
          >
            <SignIn />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
