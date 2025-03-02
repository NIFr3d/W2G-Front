"use client";

import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import SubtitlesOctopus from "@/public/assets/js/subtitles-octopus.js";

import Player from "video.js/dist/types/player";

export default function VideoPlayer({
  videoURL,
  onReady,
}: {
  videoURL: string;
  onReady?: (player: Player) => void;
}) {
  const options = {
    autoplay: true,
    controls: true,
    fluid: true,
    controlBar: {
      volumePanel: {
        inline: false,
      },
    },
    sources: [
      {
        src: `/api/video/${videoURL}`,
        type: "video/mp4",
      },
    ],
  };

  const [octopusInstance, setOctopusInstance] = useState<any>();

  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");

      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);
        const player = (playerRef.current = videojs(
          videoElement,
          options,
          () => {
            videojs.log("player is ready");
            if (onReady) {
              onReady(player);
            }
            // add subtitles
            const octopusOptions = {
              video: document.getElementsByTagName("video")[0],
              subUrl: `/api/subtitles/${videoURL}`,
              workerUrl: "/assets/js/subtitles-octopus-worker.js",
            };
            setOctopusInstance(new SubtitlesOctopus(octopusOptions));
          }
        ));
      }
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options]);

  useEffect(() => {
    const player = playerRef.current;
    // Clean up function to dispose the player after the component unmounts
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
        octopusInstance?.dispose();
      }
    };
  }, []);

  return (
    <>
      <script src="/assets/js/subtitles-octopus.js" />
      <div className="video-player" data-vjs-player>
        <div ref={videoRef} />
      </div>
    </>
  );
}
