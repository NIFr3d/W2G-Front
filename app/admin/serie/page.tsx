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
import { useDeleteSeries } from "@/lib/queries/admin.hooks";
import { useSeries } from "@/lib/queries/serie.hooks";
import NewSerieDialog from "@/components/admin/NewSerieDialog";

export default function Component() {
  const { toast } = useToast();

  const { data: series } = useSeries({});
  const deleteSeriesMutation = useDeleteSeries();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSeries, setFilteredSeries] = useState<Serie[]>([]);

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
    <div className="w-full bg-muted/40 py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gestion des séries</h1>
          <NewSerieDialog />
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
