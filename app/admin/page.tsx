"use client";

import type { Serie } from "@/lib/types";

import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
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

export default function Component() {
  const apiUrl = process.env.API_URL ?? "http://localhost:8080";
  const cookies = useCookies();
  const [series, setSeries] = useState<Serie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredSeries = series.filter((show) =>
    show.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveNewSeries = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const thumbnail = formData.get("thumbnail") as File;
    console.log(thumbnail);

    const response = await fetch(`${apiUrl}/serie`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
      },
      body: formData,
    });

    if (response.ok) {
      // Refresh the series list
      fetch(`${apiUrl}/serie`, {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setSeries(data));
    } else {
      // Handle error
      console.error("Failed to save new series");
    }
  };

  useEffect(() => {
    fetch(`${apiUrl}/serie`, {
      headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSeries(data));
  }, []);

  const handleEditSeries = (id: number) => {};
  const handleDeleteSeries = (id: number) => {
    fetch(`${apiUrl}/serie/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
      },
    });
  };
  return (
    <div className="w-full min-h-screen bg-muted/40 py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Dialog>
            <DialogTrigger className="h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90">
              Ajouter une série
            </DialogTrigger>
            <DialogContent className="min-w-[40rem]">
              <DialogHeader>
                <DialogTitle>Ajouter une série</DialogTitle>
                <DialogDescription className="p-2">
                  <form id="newSerieForm" onSubmit={handleSaveNewSeries}>
                    <div className="mt-2">
                      <Label htmlFor="title">Titre</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Ajouter un titre"
                        className="mt-2"
                      />
                    </div>
                    <div className="mt-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Ajouter la description de la série"
                        className="mt-2"
                      />
                    </div>
                    <div className="mt-2">
                      <Label htmlFor="thumbnail">Miniature</Label>
                      <Input
                        id="thumbnail"
                        name="thumbnail"
                        type="file"
                        className="mt-2"
                      />
                    </div>
                  </form>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose>
                  <Button form="newSerieForm" type="submit">
                    Enregistrer
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
            {filteredSeries.map((series) => (
              <Card key={series.id}>
                <CardHeader>
                  <div className="rounded-lg overflow-hidden aspect-video">
                    <img
                      src="/placeholder.svg"
                      alt={`${series.title} Thumbnail`}
                      width={800}
                      height={450}
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: "800/450", objectFit: "cover" }}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <h2 className="text-xl font-bold">{series.title}</h2>
                  <p className="text-muted-foreground">{series.description}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => handleEditSeries(series.id)}
                  >
                    Modifier
                  </Button>
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
                            onClick={() => handleDeleteSeries(series.id)}
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
