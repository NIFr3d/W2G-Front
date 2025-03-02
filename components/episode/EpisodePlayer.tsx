"use client";

import VideoPlayer from "./VideoPlayer";

export default function EpisodePlayer({ videoURL }: { videoURL: string }) {
  return <VideoPlayer videoURL={videoURL} />;
}
