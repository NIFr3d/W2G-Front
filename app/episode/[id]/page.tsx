"use client";

import ViewersPanel from "@/components/episode/ViewersPanel";
import { Button } from "@/components/ui/button";
import { useEpisode } from "@/lib/queries/serie.hooks";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const episodeId = params?.id as string | undefined;
  const { data: episode } = useEpisode(episodeId ?? "");

  const viewers = [
    {
      id: 1,
      username: "JohnDoe",
      watchTime: "00:12:30",
    },
    {
      id: 2,
      username: "JaneDoe",
      watchTime: "00:05:45",
    },
    {
      id: 3,
      username: "FooBar",
      watchTime: "00:00:30",
    },
  ];
  return (
    <div className="container p-6 lg:py-10 ml-6">
      {typeof episode !== "undefined" ? (
        <div className="grid lg:grid-cols-[1fr,300px] gap-6">
          <div className="space-y-6">
            {/* Video Player (simulated) */}
            <div className="relative bg-black aspect-video w-full rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg?height=720&width=1280"
                alt="Video Player"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Episode Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Saison {episode.season.number} • Episode {episode.episode}
                </div>
                {/* <h1 className="text-2xl font-bold">{episode.title}</h1> 
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Duration: {episodeData.duration}
                  </span>
                </div>
                */}
              </div>

              <p className="text-muted-foreground">{episode.description}</p>

              {/* Episode Navigation */}
              <div className="flex items-center justify-between pt-4">
                <Button variant="outline">Episode précédent</Button>
                <Button>Episode suivant</Button>
              </div>
            </div>
          </div>

          {/* Current Viewers Sidebar */}
          <ViewersPanel viewers={viewers} />
        </div>
      ) : (
        <div className="text-xl">Pas d'épisode trouvé</div>
      )}
    </div>
  );
}
