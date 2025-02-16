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
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  useSerie,
  useSeasons,
  useVideos,
  useUpdateSerie,
  useAddSeason,
  useRemoveSeason,
  useSaveThumbnail,
  useAddVideo,
  useRemoveVideo,
} from "@/lib/queries/admin.hooks";

export default function Page() {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const serieId = params.id as string;
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
  const [isAddVideoDialogOpen, setIsAddVideoDialogOpen] = useState(false);
  const [currentSeasonNumber, setCurrentSeasonNumber] = useState<number | null>(
    null
  );
  const [episodeStart, setEpisodeStart] = useState<number>(1);
  const [episodeEnd, setEpisodeEnd] = useState<number | null>(null);
  const [episodeFiles, setEpisodeFiles] = useState<FileList | null>(null);

  const { data: serieData } = useSerie(serieId);
  const { data: seasonsData } = useSeasons(serieId);
  const { data: videosData } = useVideos(serieId);
  const updateSerieMutation = useUpdateSerie();
  const addSeasonMutation = useAddSeason();
  const removeSeasonMutation = useRemoveSeason();
  const saveThumbnailMutation = useSaveThumbnail();
  const addVideoMutation = useAddVideo();
  const removeVideoMutation = useRemoveVideo();

  useEffect(() => {
    if (serieData) {
      setSerie(serieData);
      setThumbnailUrl(`/api/serie/${serieId}/thumbnail`);
    }
    if (seasonsData) {
      setSeasons(seasonsData.sort((a, b) => a.number - b.number));
    }
    if (videosData) {
      setVideos(videosData);
    }
  }, [serieData, seasonsData, videosData, serieId]);

  const handleUpdateSerie = () => {
    if (!serie) return;
    setIsLoading(true);
    updateSerieMutation.mutate(
      { id: serieId, data: serie },
      {
        onSuccess: (updatedSerie) => {
          setSerie(updatedSerie);
          setIsLoading(false);
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
          setIsLoading(false);
        },
      }
    );
  };

  const handleAddSeason = () => {
    setIsLoading(true);
    addSeasonMutation.mutate(serieId, {
      onSuccess: () => {
        setIsLoading(false);
        toast({
          title: "Succès",
          description: "Saison ajoutée avec succès",
        });
      },
      onError: (error) => {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
      },
    });
  };

  const handleRemoveSeason = (seasonId: number) => {
    setIsLoading(true);
    removeSeasonMutation.mutate(
      { serieId, seasonId },
      {
        onSuccess: () => {
          setIsLoading(false);
          toast({
            title: "Succès",
            description: "Saison supprimée avec succès",
          });
        },
        onError: (error) => {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
        },
      }
    );
  };

  const handleSaveThumbnail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setIsLoading(true);
    saveThumbnailMutation.mutate(
      { id: serieId, formData },
      {
        onSuccess: () => {
          toast({
            title: "Miniature mise à jour",
            description: "La miniature a été mise à jour avec succès",
          });
          setThumbnailUrl(`/api/serie/${serieId}/thumbnail?${Date.now()}`);
          setIsLoading(false);
        },
        onError: (error) => {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
        },
      }
    );
  };

  const handleAddvideo = (seasonNumber: number) => {
    setCurrentSeasonNumber(seasonNumber);
    const videosOfSeason = videos.filter(
      (v) => v.season.number === seasonNumber
    );
    const lastEpisodeNumber =
      videosOfSeason.length > 0
        ? Math.max(...videosOfSeason.map((v) => v.episode))
        : 0;
    setEpisodeStart(lastEpisodeNumber + 1);
    setEpisodeEnd(null);
    setEpisodeFiles(null);
    setIsAddVideoDialogOpen(true);
  };

  const handleEpisodeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEpisodeFiles(e.target.files);
      if (e.target.files.length > 1) {
        setEpisodeEnd(episodeStart + e.target.files.length - 1);
      } else {
        setEpisodeEnd(null);
      }
    } else {
      setEpisodeFiles(null);
      setEpisodeEnd(null);
    }
  };

  const handleSubmitEpisodes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSeasonNumber || !episodeFiles) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("episodeStart", episodeStart.toString());
    Array.from(episodeFiles).forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    addVideoMutation.mutate(
      { id: serieId, seasonNumber: currentSeasonNumber, formData },
      {
        onSuccess: () => {
          setIsLoading(false);
          setIsAddVideoDialogOpen(false);
          toast({
            title: "Succès",
            description: `${
              episodeEnd ? episodeEnd - episodeStart : 1
            } episode(s) ajouté(s) à la saison ${currentSeasonNumber}`,
          });
        },
        onError: (error) => {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
        },
      }
    );
  };

  const handleRemoveVideo = (seasonId: number, videoId: number) => {
    setIsLoading(true);
    removeVideoMutation.mutate(
      { id: serieId, seasonId, videoId },
      {
        onSuccess: () => {
          setIsLoading(false);
          toast({
            title: "Succès",
            description: `Episode supprimé avec succès`,
          });
        },
        onError: (error) => {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
        },
      }
    );
  };

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
          <Separator />
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
          <Separator />
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
                        Ajout d'épisode(s)
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
                      {videos
                        .filter((v) => v.season.number == season.number)
                        .map((video: Video) => (
                          <div
                            key={video.id}
                            className="flex items-center justify-between bg-background p-2 rounded"
                          >
                            <span>Episode {video.episode}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveVideo(season.id, video.id)
                              }
                            >
                              Supprimer
                            </Button>
                          </div>
                        ))}
                      {videos.filter((v) => v.season.number == season.number)
                        .length === 0 && (
                        <p className="text-muted-foreground">
                          Aucun épisode pour cette saison.
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
      <Dialog
        open={isAddVideoDialogOpen}
        onOpenChange={setIsAddVideoDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajout d'épisode(s)</DialogTitle>
            <DialogDescription>
              Ajouter un ou plusieurs épisodes pour la saison{" "}
              {currentSeasonNumber}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEpisodes}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="episodeStart" className="text-right">
                  {episodeFiles && episodeFiles.length > 1
                    ? "Début"
                    : "Numéro de l'épisode"}
                </Label>
                <Input
                  id="episodeStart"
                  type="number"
                  value={episodeStart}
                  onChange={(e) => {
                    const newStart = parseInt(e.target.value, 10);
                    setEpisodeStart(newStart);
                    if (episodeFiles && episodeFiles.length > 1) {
                      setEpisodeEnd(newStart + episodeFiles.length - 1);
                    }
                  }}
                  className="col-span-3"
                />
              </div>
              {episodeFiles && episodeFiles.length > 1 && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="episodeEnd" className="text-right">
                    Fin
                  </Label>
                  <Input
                    id="episodeEnd"
                    type="number"
                    value={episodeEnd || ""}
                    readOnly
                    className="col-span-3"
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="episodeFiles" className="text-right">
                  Fichier(s)
                </Label>
                <Input
                  id="episodeFiles"
                  type="file"
                  onChange={handleEpisodeFileChange}
                  multiple
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!episodeFiles || isLoading}>
                {isLoading ? "Envoie..." : "Envoyer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
