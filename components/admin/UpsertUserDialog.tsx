"use client";

import { User } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useAddUser, useUpdateUser } from "@/lib/queries/admin.hooks";

const userSchema = z.object({
  username: z.string().nonempty("Le nom d'utilisateur est requis"),
  password: z.string(),
  isAdmin: z.boolean(),
});

export default function UpsertUserDialog({
  user,
  onClose,
}: {
  user?: User;
  onClose: () => void;
}) {
  const { toast } = useToast();

  const { mutate: addUser } = useAddUser();
  const { mutate: updateUser } = useUpdateUser();

  const methods = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user?.username ?? "",
      password: user?.password ?? "",
      isAdmin: user?.role === "ADMIN",
    },
  });

  const { handleSubmit, formState } = methods;

  const onSubmit = useCallback((data: FieldValues) => {
    if (typeof user === "undefined") {
      addUser(
        {
          username: data.username,
          password: data.password,
          role: data.isAdmin ? "ADMIN" : "USER",
        },
        {
          onSuccess: () => {
            toast({
              title: "Succès",
              description: "L'utilisateur a été ajouté avec succès",
            });
            onClose();
          },
          onError: (error) => {
            toast({
              title: "Erreur",
              description: error.message,
              variant: "destructive",
            });
          },
        }
      );
    } else {
      updateUser(
        {
          id: user.id,
          username: data.username,
          password: data.password,
          role: data.isAdmin ? "ADMIN" : "USER",
        },
        {
          onSuccess: () => {
            toast({
              title: "Succès",
              description: "L'utilisateur a été mis à jour avec succès",
            });
            onClose();
          },
          onError: (error) => {
            toast({
              title: "Erreur",
              description: error.message,
              variant: "destructive",
            });
          },
        }
      );
    }
  }, []);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {typeof user !== "undefined"
              ? "Modifier un utilisateur"
              : "Ajouter un utilisateur"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                {...methods.register("username")}
                placeholder="Nom d'utilisateur"
              />
            </div>
            <p className="text-red-500 pl-8">
              {formState.errors.username?.message}
            </p>
            <div>
              <Label htmlFor="password">
                Mot de passe (laisser vide pour ne pas modifier)
              </Label>
              <Input
                id="password"
                type="password"
                {...methods.register("password")}
                placeholder="Mot de passe"
              />
            </div>
            <p className="text-red-500 pl-8">
              {formState.errors.password?.message}
            </p>
            <div className="flex flex-row items-center gap-4">
              Administrateur ?{" "}
              <Checkbox
                className="mt-[1px]"
                id="isAdmin"
                checked={methods.watch("isAdmin")}
                onCheckedChange={(isAdmin) => {
                  methods.setValue(
                    "isAdmin",
                    typeof isAdmin !== "boolean" ? false : isAdmin
                  );
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "Envoie..." : "Envoyer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
