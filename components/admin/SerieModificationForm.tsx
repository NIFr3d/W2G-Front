"use client";

import { useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { useUpdateSerie } from "@/lib/queries/admin.hooks";
import { Serie } from "@/lib/types";
import z from "zod";

const serieSchema = z.object({
  title: z
    .string()
    .nonempty("Le titre est requis")
    .max(255, "Le titre ne doit pas dépasser 255 caractères"),
  description: z.string().nonempty("La description est requise"),
});

export default function SerieModificationForm({ serie }: { serie: Serie }) {
  const { toast } = useToast();

  const updateSerieMutation = useUpdateSerie();

  const methods = useForm({
    defaultValues: {
      title: serie.title,
      description: serie.description,
    },
    resolver: zodResolver(serieSchema),
  });

  const { reset, register, handleSubmit, formState } = methods;

  const onSubmit = useCallback((data: FieldValues) => {
    updateSerieMutation.mutate(
      { id: serie.id.toString(), data },
      {
        onSuccess: () => {
          toast({
            title: "Série mise à jour",
            description: "La série a été mise à jour avec succès",
          });
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
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input id="title" {...register("title")} />
          <p className="text-red-500">{formState.errors.title?.message}</p>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} />
          <p className="text-red-500">
            {formState.errors.description?.message}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => reset()}>
            Annuler
          </Button>
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? "En cours..." : "Enregistrer"}
          </Button>
        </div>
      </form>
      <Separator />
    </>
  );
}
