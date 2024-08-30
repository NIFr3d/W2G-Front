"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Season, Serie, Video } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
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
import { ChevronUp, ChevronDown, Edit2, Save } from "lucide-react";

export default function Page() {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const serieId = params.id;
  const [isLoading, setIsLoading] = useState(false);
  const [serie, setSerie] = useState<Serie | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [editingSeasonId, setEditingSeasonId] = useState<number | null>(null);
  const [editedSeasonNumber, setEditedSeasonNumber] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetch(`/api/serie/${serieId}`)
      .then((res) => res.json())
      .then(setSerie);
    fetch(`/api/serie/${serieId}/season`)
      .then((res) => res.json())
      .then((res) => {
        setSeasons(res.sort((a: Season, b: Season) => a.number - b.number));
        setThumbnailUrl(`/api/serie/${serieId}/thumbnail`);
      });
  }, [serieId]);

  const handleUpdateSerie = () => {
    if (!serie) return;
    setIsLoading(true);
    fetch(`/api/serie/${serieId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serie),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }
        toast({
          title: "Série mise à jour",
          description: "La série a été mise à jour avec succès",
        });
        setIsLoading(false);
        setSerie(await res.json());
      })
      .catch((error) => {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
      });
  };
  const handleAddSeason = async () => {
    if (!serie) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    fetch(`/api/serie/${serieId}/season`, {
      method: "POST",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        } else {
          fetch(`/api/serie/${serieId}/season`)
            .then((res) => res.json())
            .then(setSeasons);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      });
  };
  const handleRemoveSeason = (seasonId: Number) => {
    setIsLoading(true);
    fetch(`/api/serie/${serieId}/season/${seasonId}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        } else {
          fetch(`/api/serie/${serieId}/season`)
            .then((res) => res.json())
            .then(setSeasons);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
      });
  };

  const handleSaveThumbnail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setIsLoading(true);
    fetch(`/api/serie/${serieId}/thumbnail`, {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        } else {
          toast({
            title: "Miniature mise à jour",
            description: "La miniature a été mise à jour avec succès",
          });
          setThumbnailUrl(`/api/serie/${serieId}/thumbnail?${Date.now()}`);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
      });
  };

  const handleAddvideo = (seasonNumber: Number) => {};
  const handleRemovevideo = (seasonNumber: Number, videoNumber: Number) => {};
  const toggleSeasonExpand = (seasonNumber: number) => {
    setExpandedSeason(expandedSeason === seasonNumber ? null : seasonNumber);
  };

  const handleEditSeasonNumber = (seasonId: number) => {
    if (editingSeasonId === seasonId) {
      // Save the edited season number
      if (editedSeasonNumber !== null) {
        fetch(
          `/api/serie/${serieId}/season/${seasonId}?number=${editedSeasonNumber}`,
          {
            method: "PUT",
          }
        )
          .then(async (res) => {
            if (!res.ok) {
              throw new Error(await res.text());
            } else {
              setSeasons(
                seasons
                  .map((season) =>
                    season.id === seasonId
                      ? { ...season, number: editedSeasonNumber }
                      : season
                  )
                  .sort((a, b) => a.number - b.number)
              );
              setEditingSeasonId(null);
              setEditedSeasonNumber(null);
              toast({
                title: "Succès",
                description: "Numéro de saison mis à jour avec succès",
              });
            }
          })
          .catch((error) => {
            toast({
              title: "Erreur",
              description: error.message,
              variant: "destructive",
            });
          });
      }
    } else {
      // Start editing
      const season = seasons.find((s) => s.id === seasonId);
      if (season) {
        setEditingSeasonId(seasonId);
        setEditedSeasonNumber(season.number);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-4 bg-background rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Modifier la série</h2>
      {serie && (
        <div className="grid gap-6">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              name="title"
              value={serie.title}
              onChange={(e) =>
                setSerie({
                  ...serie,
                  title: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={serie.description}
              onChange={(e) =>
                setSerie({
                  ...serie,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Annuler
            </Button>
            <Button onClick={handleUpdateSerie} disabled={isLoading}>
              {isLoading ? "En cours..." : "Enregistrer"}
            </Button>
          </div>
          <div className="flex flex-row w-full">
            <form onSubmit={handleSaveThumbnail} className="w-full">
              <Label htmlFor="thumbnail">Miniature</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  type="file"
                  accept="image/*"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Envoie..." : "Envoyer"}
                </Button>
              </div>
            </form>
            {serie && (
              <img
                src={thumbnailUrl}
                alt="Miniature de la série"
                className="mt-2 max-w-xs rounded-md ml-12"
              />
            )}
          </div>

          <div className="grid gap-4">
            <h3 className="text-xl font-bold">Saisons</h3>
            <div className="grid gap-2">
              {seasons.map((season) => (
                <div>
                  <div
                    key={season.number}
                    className="bg-muted/40 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <button
                        onClick={() => toggleSeasonExpand(season.number)}
                        className="flex items-center text-lg font-semibold hover:text-primary transition-colors"
                        aria-expanded={expandedSeason === season.number}
                      >
                        {editingSeasonId === season.id ? (
                          <Input
                            type="number"
                            value={editedSeasonNumber || ""}
                            onChange={(e) =>
                              setEditedSeasonNumber(
                                parseInt(e.target.value, 10)
                              )
                            }
                            className="w-20 mr-2"
                          />
                        ) : (
                          <span>Saison {season.number}</span>
                        )}
                        {expandedSeason === season.number ? (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSeasonNumber(season.id)}
                      >
                        {editingSeasonId === season.id ? (
                          <Save className="h-4 w-4" />
                        ) : (
                          <Edit2 className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddvideo(season.number)}
                      >
                        Add video
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Supprimer</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Etes-vous sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tous les fichiers liés à la saison seront
                              supprimés.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button
                                variant="destructive"
                                onClick={() => handleRemoveSeason(season.id)}
                              >
                                Supprimer
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {expandedSeason === season.number && (
                    <div className="mt-2 space-y-2">
                      {videos[season.number]?.map(
                        (
                          video //TODO : Add actual video data implementation
                        ) => (
                          <div
                            key={video.id}
                            className="flex items-center justify-between bg-background p-2 rounded"
                          >
                            <span>
                              {video.number}. {video.title}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveVideo(season.number, video.id)
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        )
                      )}
                      {videos[season.number]?.length === 0 && (
                        <p className="text-muted-foreground">
                          No videos in this season.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={handleAddSeason}>
              Ajouter une saison
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
