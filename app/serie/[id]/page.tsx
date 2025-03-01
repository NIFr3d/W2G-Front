"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { useSerie } from "@/lib/queries/serie.hooks";
import { useParams } from "next/navigation";

export default function Component() {
  const params = useParams();
  const serieId = params?.id as string | undefined;

  const { data: serie } = useSerie(serieId ?? "");

  return (
    <main className="max-w-6xl mx-auto py-12 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="rounded-lg overflow-hidden">
          <img
            src={`/api/serie/${serie?.id}/thumbnail`}
            alt="Series Thumbnail"
            width={400}
            height={500}
            className="object-cover"
            style={{ aspectRatio: "400/500", objectFit: "cover" }}
          />
        </div>
        <div className="grid gap-4">
          <div>
            <h1 className="text-3xl font-bold">{serie?.title}</h1>
            <p className="text-muted-foreground">
              {serie?.description || "Chargement..."}
            </p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="grid gap-4">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="season1">Season 1</SelectItem>
                    <SelectItem value="season2">Season 2</SelectItem>
                    <SelectItem value="season3">Season 3</SelectItem>
                    <SelectItem value="season4">Season 4</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="grid gap-3">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-20 text-right text-muted-foreground">
                    S1E1
                    <div className="text-sm">43m</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      Chapter One: The Vanishing of Will Byers
                    </div>
                    <p className="text-sm text-muted-foreground">
                      A young boy's sudden disappearance sets off a series of
                      events that reveal dark secrets and supernatural mysteries
                      in a small Indiana town.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-20 text-right text-muted-foreground">
                    S1E2
                    <div className="text-sm">42m</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      Chapter Two: The Weirdo on Maple Street
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Will's family and friends search for answers, while the
                      local police chief uncovers a potential conspiracy.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-20 text-right text-muted-foreground">
                    S1E3
                    <div className="text-sm">49m</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      Chapter Three: Holly, Jolly
                    </div>
                    <p className="text-sm text-muted-foreground">
                      As the search for Will intensifies, a suspicious package
                      leads to a tense confrontation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-20 text-right text-muted-foreground">
                    S1E4
                    <div className="text-sm">46m</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Chapter Four: The Body</div>
                    <p className="text-sm text-muted-foreground">
                      Hopper's investigation leads him to a government lab,
                      while the boys search for a way to locate Will.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
