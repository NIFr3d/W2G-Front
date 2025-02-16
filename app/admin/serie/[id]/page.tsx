"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Season, Serie, Video } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { ChevronUp, ChevronDown, Edit2, Save } from "lucide-react";
import {
  useSerie,
  useSeasons,
  useVideos,
  useAddSeason,
  useRemoveSeason,
  useRemoveVideo,
  useEditSeasonNumber,
} from "@/lib/queries/admin.hooks";
import SerieModificationForm from "@/components/admin/SerieModificationForm";
import SerieThumbnailForm from "@/components/admin/SerieThumbnailForm";
import AddVideoDialog from "@/components/admin/AddVideoDialog";
import CustomAlertDialog from "@/components/general/customalertdialog";

export default function Page() {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const serieId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);

  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [editingSeasonId, setEditingSeasonId] = useState<number | null>(null);
  const [editedSeasonNumber, setEditedSeasonNumber] = useState<number | null>(
    null
  );
  const [currentSeasonNumber, setCurrentSeasonNumber] = useState<number | null>(
    null
  );

  const { data: serie } = useSerie(serieId);
  const { data: seasons } = useSeasons(serieId);
  const { data: videos } = useVideos(serieId);
  const addSeasonMutation = useAddSeason();
  const removeSeasonMutation = useRemoveSeason();
  const removeVideoMutation = useRemoveVideo();
  const editSeasonNumberMutation = useEditSeasonNumber();

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
        editSeasonNumberMutation.mutate(
          { serieId, seasonId, newNumber: editedSeasonNumber! },
          {
            onSuccess: () => {
              setEditingSeasonId(null);
              setEditedSeasonNumber(null);
              toast({
                title: "Succès",
                description: "Numéro de saison mis à jour avec succès",
              });
            },
            onError: (error: any) => {
              toast({
                title: "Erreur",
                description: error.message,
                variant: "destructive",
              });
            },
          }
        );
      }
    } else {
      // Start editing
      const season = seasons?.find((s) => s.id === seasonId);
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
          <SerieModificationForm serie={serie} />
          <SerieThumbnailForm serie={serie} />
          <div className="grid gap-4">
            <h3 className="text-xl font-bold">Saisons</h3>
            <div className="grid gap-2">
              {seasons?.map((season) => (
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
                        onClick={() => setCurrentSeasonNumber(season.number)}
                      >
                        Ajout d'épisode(s)
                      </Button>
                      <CustomAlertDialog
                        title="Supprimer la saison"
                        description="Tous les fichiers liés à la saison seront supprimés."
                        variant="destructive"
                        onConfirm={() => handleRemoveSeason(season.id)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  {expandedSeason === season.number && (
                    <div className="mt-2 space-y-2">
                      {videos
                        ?.filter((v) => v.season.number == season.number)
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
                              disabled={isLoading}
                            >
                              Supprimer
                            </Button>
                          </div>
                        ))}
                      {videos?.filter((v) => v.season.number == season.number)
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
          {currentSeasonNumber && videos && (
            <AddVideoDialog
              serie={serie}
              start={
                Math.max(
                  0,
                  ...videos
                    .filter((v) => v.season.number === currentSeasonNumber)
                    .map((v) => v.episode)
                ) + 1
              }
              seasonNumber={currentSeasonNumber}
              onClose={() => setCurrentSeasonNumber(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
