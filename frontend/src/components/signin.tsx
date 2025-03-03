"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignIn() {
  return (
    <form>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nombre Completo</Label>
          <Input id="name" type="text" placeholder="Juan Pérez" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="register-email">Correo Electrónico</Label>
          <Input
            id="register-email"
            type="email"
            placeholder="ejemplo@correo.com"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="register-password">Contraseña</Label>
          <Input id="register-password" type="password" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
          <Input id="confirm-password" type="password" />
        </div>
        <Button type="submit" className="w-full">
          Crear Cuenta
        </Button>
      </div>
    </form>
  );
}
