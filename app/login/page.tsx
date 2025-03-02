"use client";
import { useCookies } from "next-client-cookies";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Page() {
  const cookies = useCookies();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("usrname") as string;
    const password = formData.get("password") as string;
    const response = await fetch(
      (process.env.API_URL ?? "http://localhost:8080") + "/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );
    if (response.ok) {
      const { token, username, role, expiresIn } = await response.json();
      cookies.set("token", token, {
        expires: new Date(Date.now() + expiresIn),
      });
      cookies.set("username", username, {
        expires: new Date(Date.now() + expiresIn),
      });
      cookies.set("role", role, {
        expires: new Date(Date.now() + expiresIn),
      });
      router.push("/");
    } else {
      setError("Nom d'utilisateur ou mot de passe incorrect");
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <form onSubmit={handleLogin}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>
              Entrez votre nom d'utilisateur et mot de passe ci-dessous pour
              vous connecter
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Nom d'utilisateur</Label>
              <Input name="usrname" type="text" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input name="password" type="password" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full" type="submit">
              Se connecter
            </Button>
            {error && (
              <div>
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
