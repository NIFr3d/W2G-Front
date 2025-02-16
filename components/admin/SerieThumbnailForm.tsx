import { Serie } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import z from "zod";
import { useCallback } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSaveThumbnail } from "@/lib/queries/admin.hooks";

const formSchema = z
  .object({
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

export default function SerieThumbnailForm({ serie }: { serie: Serie }) {
  const { toast } = useToast();

  const saveThumbnailMutation = useSaveThumbnail();

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      thumbnail: [] as FileList[],
    },
  });

  const { register, handleSubmit, formState } = methods;

  const onSubmit = useCallback((data: FieldValues) => {
    const formData = new FormData();
    formData.append("thumbnail", data.thumbnail[0]);
    saveThumbnailMutation.mutate(
      { id: serie.id.toString(), formData },
      {
        onSuccess: () => {
          toast({
            title: "Miniature mise à jour",
            description: "La miniature a été mise à jour avec succès",
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
      <div className="flex flex-row w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <Label htmlFor="thumbnail">Miniature</Label>
          <div className="flex items-center gap-2">
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              {...register("thumbnail")}
            />

            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "Envoie..." : "Envoyer"}
            </Button>
          </div>
          <p className="text-red-500">{formState.errors.thumbnail?.message}</p>
        </form>
        <img
          src={`/api/serie/${serie.id}/thumbnail`}
          alt="Miniature de la série"
          className="mt-2 max-w-xs rounded-md ml-12"
        />
      </div>
      <Separator />
    </>
  );
}
