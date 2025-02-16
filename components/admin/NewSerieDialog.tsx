"use client";

import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useState, useCallback } from "react";
import { useAddSeries } from "@/lib/queries/admin.hooks";

const serieSchema = z
  .object({
    title: z
      .string()
      .nonempty("Ce champs ne doit pas être vide")
      .max(255, "Ce champs ne doit pas dépasser 255 caractères"),
    description: z.string().nonempty("Ce champs ne doit pas être vide"),
    thumbnail: z.instanceof(FileList, {
      message: "Le fichier doit être une image au format JPEG ou PNG",
    }),
  })
  .refine(
    (data) => {
      if (data.thumbnail.length === 0) return false;
      return ["image/jpeg", "image/png"].includes(data.thumbnail[0].type);
    },
    {
      message: "Le fichier doit être une image au format JPEG ou PNG",
      path: ["thumbnail"],
    }
  );

export default function NewSerieDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const addSeriesMutation = useAddSeries();

  const methods = useForm({
    resolver: zodResolver(serieSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail: [] as FileList[],
    },
  });
  const { register, handleSubmit, reset, formState } = methods;

  const handleSaveNewSeries = useCallback(async (data: FieldValues) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("thumbnail", data.thumbnail[0]);
      await addSeriesMutation.mutateAsync(formData);
      setIsDialogOpen(false);
      reset();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  }, []);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <form id="newSerieForm" onSubmit={handleSubmit(handleSaveNewSeries)}>
        <DialogTrigger className="h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90">
          Ajouter une série
        </DialogTrigger>
        <DialogContent className="min-w-[40rem]">
          <DialogHeader>
            <DialogTitle>Ajouter une série</DialogTitle>
            <DialogDescription className="p-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                {...register("title", { required: true })}
                className="my-2"
              />
              {methods.formState.errors.title && (
                <span className="text-red-500" role="alert">
                  {formState.errors.title?.message}
                </span>
              )}
              <br />
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description", { required: true })}
                className="my-2"
              />
              {methods.formState.errors.description && (
                <span className="text-red-500" role="alert">
                  {formState.errors.description?.message}
                </span>
              )}
              <br />
              <Label htmlFor="thumbnail">Miniature</Label>
              <Input
                id="thumbnail"
                type="file"
                multiple={false}
                {...register("thumbnail", { required: true })}
                className="my-2"
              />
              {methods.formState.errors.thumbnail && (
                <span className="text-red-500" role="alert">
                  {formState.errors.thumbnail?.message}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              type="button"
              onClick={() => {
                reset();
                setIsDialogOpen(false);
              }}
              className="border rounded-lg mr-2 shadow-mg p-2 hover:bg-secondary/80"
            >
              Annuler
            </DialogClose>
            <Button form="newSerieForm" type="submit">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
