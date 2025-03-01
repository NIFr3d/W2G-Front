"use client";

import { useEpisode } from "@/lib/queries/serie.hooks";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const episodeId = params?.id as string | undefined;
  const { data: episode } = useEpisode(episodeId ?? "");
}
