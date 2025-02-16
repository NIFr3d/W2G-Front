"use client";

import type { Serie } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useSeries,
  useAddSeries,
  useDeleteSeries,
} from "@/lib/queries/admin.hooks";

const serieSchema = z
  .object({
    title: z
      .string()
      .nonempty("Ce champs ne doit pas être vide")
      .max(255, "Ce champs ne doit pas dépasser 255 caractères"),
    description: z.string().nonempty("Ce champs ne doit pas être vide"),
    thumbnail: z.instanceof(FileList),
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

export default function Component() {
  const { toast } = useToast();

  const { data: series } = useSeries();
  const addSeriesMutation = useAddSeries();
  const deleteSeriesMutation = useDeleteSeries();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSeries, setFilteredSeries] = useState<Serie[]>([]);

  const methods = useForm({
    resolver: zodResolver(serieSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail: [],
    },
  });
  const { reset, register, handleSubmit } = methods;

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

  const handleDeleteSeries = useCallback(async (id: number) => {
    try {
      await deleteSeriesMutation.mutateAsync(id);
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

  useEffect(() => {
    if (typeof series === "undefined") return;
    setFilteredSeries(
      series.filter((show) =>
        show.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, series]);

  return (
    <div className="w-full min-h-screen bg-muted/40 py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Panneau d'administration</h1>
          <form id="newSerieForm" onSubmit={handleSubmit(handleSaveNewSeries)}>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger className="h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90">
                Ajouter une série
              </DialogTrigger>
              <DialogContent className="min-w-[40rem]">
                <DialogHeader>
                  <DialogTitle>Ajouter une série</DialogTitle>
                  <DialogDescription className="p-2">
                    <span className="mt-2">
                      <Label htmlFor="title">Titre</Label>
                      <Input
                        id="title"
                        placeholder="Ajouter un titre"
                        className="my-2"
                        {...register("title", { required: true })}
                      />
                      {methods.formState.errors.title && (
                        <span className="text-red-500" role="alert">
                          {typeof methods.formState.errors.title?.message ===
                            "string" && methods.formState.errors.title.message}
                        </span>
                      )}
                    </span>
                    <br />
                    <span className="mt-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Ajouter la description de la série"
                        className="my-2"
                        {...register("description", { required: true })}
                      />
                      {methods.formState.errors.description && (
                        <span className="text-red-500" role="alert">
                          {typeof methods.formState.errors.description
                            ?.message === "string" &&
                            methods.formState.errors.description.message}
                        </span>
                      )}
                    </span>
                    <br />
                    <span className="mt-2">
                      <Label htmlFor="thumbnail">Miniature</Label>
                      <Input
                        id="thumbnail"
                        type="file"
                        className="my-2"
                        multiple={false}
                        {...register("thumbnail", { required: true })}
                      />
                      {methods.formState.errors.thumbnail && (
                        <span className="text-red-500" role="alert">
                          {typeof methods.formState.errors.thumbnail
                            ?.message === "string" &&
                            methods.formState.errors.thumbnail.message}
                        </span>
                      )}
                    </span>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="border rounded-lg mr-2 shadow-mg p-2 hover:bg-secondary/80"
                  >
                    Annuler
                  </DialogClose>
                  <Button form="newSerieForm" type="submit">
                    Enregistrer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </form>
        </div>
        <div className="bg-background rounded-lg shadow-md p-6">
          <div className="mb-6">
            <Input
              placeholder="Rechercher une série..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeries.map((serie) => (
              <Card key={serie.id} className="max-w-72">
                <CardHeader>
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={`/api/serie/${serie.id}/thumbnail`}
                      alt={`${serie.title} Thumbnail`}
                      width={300}
                      height={450}
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: "300/450", objectFit: "cover" }}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <h2 className="text-xl font-bold">{serie.title}</h2>
                  <p className="text-muted-foreground">{serie.description}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <Link href={`/admin/serie/${serie.id}`}>
                    <Button variant="outline">Modifier</Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Supprimer</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Etes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tous les fichiers liés à la série seront supprimés.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteSeries(serie.id)}
                          >
                            Supprimer
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
