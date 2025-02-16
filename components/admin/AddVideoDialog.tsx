import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Serie } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { useAddVideo } from "@/lib/queries/admin.hooks";
import { useToast } from "@/components/ui/use-toast";

const episodesSchema = z
  .object({
    episodeStart: z.coerce.number().int().min(1, "Doit être supérieur à 0"),
    episodeFiles: z.instanceof(FileList, {
      message: "Uniquement les formats MP4 et MKV sont autorisés",
    }),
  })
  .refine(
    (data) => {
      if (data.episodeFiles.length === 0) return false;
      for (let i = 0; i < data.episodeFiles.length; i++) {
        if (
          !["video/mp4", "video/x-matroska"].includes(data.episodeFiles[i].type)
        ) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Uniquement les formats MP4 et MKV sont autorisés",
      path: ["episodeFiles"],
    }
  );

export default function AddVideoDialog({
  serie,
  seasonNumber,
  start,
  onClose,
}: {
  serie: Serie;
  seasonNumber: number;
  start: number;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const addVideoMutation = useAddVideo();

  const [episodeEnd, setEpisodeEnd] = useState<number | null>(null);

  const methods = useForm({
    resolver: zodResolver(episodesSchema),
    defaultValues: {
      episodeStart: start,
      episodeFiles: [] as FileList[],
    },
  });

  const { register, handleSubmit, formState, watch } = methods;

  const { episodeStart, episodeFiles } = watch();

  const onSubmit = useCallback((data: FieldValues) => {
    const formData = new FormData();
    formData.append("episodeStart", data.episodeStart.toString());
    for (let i = 0; i < data.episodeFiles.length; i++) {
      formData.append("files", data.episodeFiles[i]);
    }
    addVideoMutation.mutate(
      {
        id: serie.id.toString(),
        seasonNumber,
        formData,
      },
      {
        onSuccess: () => {
          toast({
            title: "Succès",
            description: `${
              episodeEnd ? episodeEnd - episodeStart : 1
            } episode(s) ajouté(s) à la saison ${seasonNumber}`,
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

    onClose();
  }, []);

  useEffect(() => {
    if (!episodeFiles || !episodeStart) return;
    const numericStart =
      typeof episodeStart === "string"
        ? parseInt(episodeStart, 10)
        : episodeStart;
    if (episodeFiles.length === 1) {
      setEpisodeEnd(null);
      return;
    }
    if (episodeFiles && episodeFiles.length > 1) {
      setEpisodeEnd(numericStart + episodeFiles.length - 1);
    }
  }, [episodeFiles, episodeStart]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajout d'épisode(s)</DialogTitle>
          <DialogDescription>
            Ajouter un ou plusieurs épisodes pour la saison
            {seasonNumber}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                className="col-span-3"
                {...register("episodeStart")}
              />
            </div>
            <p className="text-red-500 pl-8">
              {formState.errors.episodeStart?.message}
            </p>
            {episodeEnd && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="episodeEnd" className="text-right">
                  Fin
                </Label>
                <Input
                  id="episodeEnd"
                  type="number"
                  readOnly
                  className="col-span-3"
                  value={episodeEnd}
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
                multiple
                className="col-span-3"
                {...register("episodeFiles")}
              />
            </div>
          </div>
          <p className="text-red-500 pl-8 mb-4">
            {formState.errors.episodeFiles?.message}
          </p>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!episodeFiles || formState.isSubmitting}
            >
              {formState.isSubmitting ? "Envoie..." : "Envoyer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
