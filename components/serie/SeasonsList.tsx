import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSeasons, useVideoBySeason } from "@/lib/queries/serie.hooks";
import { Serie } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SeasonsList({ serie }: { serie: Serie }) {
  const router = useRouter();
  const { data: seasons } = useSeasons(serie.id.toString());

  const [selectedSeason, setSelectedSeason] = useState<string | undefined>();

  const { data: episodes } = useVideoBySeason(
    serie.id.toString(),
    selectedSeason ?? ""
  );

  useEffect(() => {
    if (seasons?.length) {
      setSelectedSeason(seasons[0].id.toString());
    }
  }, [seasons]);

  return (
    <div className="bg-muted rounded-lg p-4">
      {seasons?.length === 0 ? (
        <div className="text-xl">Aucune saison pour l'instant</div>
      ) : (
        <div className="grid gap-4">
          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez une saison" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {seasons?.map((season) => (
                  <SelectItem key={season.id} value={season.id.toString()}>
                    Saison {season.number}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="grid gap-3">
            {episodes?.map((episode) => (
              <div
                key={episode.id}
                className="flex items-start gap-4 cursor-pointer"
                onClick={() => router.push(`/episode/${episode.id}`)}
              >
                <div className="flex-shrink-0 w-20 text-right text-muted-foreground">
                  S
                  {
                    seasons?.find((s) => s.id.toString() === selectedSeason)
                      ?.number
                  }
                  E{episode.episode}
                  <div className="text-sm">43m</div>
                </div>
                <div className="flex-1">
                  <div className="font-medium">Episode {episode.episode}</div>
                  <p className="text-sm text-muted-foreground">
                    {episode.description}
                  </p>
                </div>
              </div>
            ))}
            {episodes?.length === 0 && (
              <div className="text-xl">Aucun épisode pour cette saison</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
