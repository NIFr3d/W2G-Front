"use client";
import SeasonsList from "@/components/serie/SeasonsList";
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
          {serie && <SeasonsList serie={serie} />}
        </div>
      </div>
    </main>
  );
}
