import { useQuery } from "@tanstack/react-query";
import { Season, Serie, Video } from "@/lib/types";

export const useSerie = (id: string) => {
  return useQuery({
    queryKey: ["serie", id],
    queryFn: async (): Promise<Serie> => {
      const response = await fetch(`/api/serie/${id}`);
      if (!response.ok) throw new Error("Failed to fetch serie");
      return response.json();
    },
  });
};

export const useSeries = (search: string = "") => {
  return useQuery({
    queryKey: ["series", search], // Include search in the query key
    queryFn: async (): Promise<Serie[]> => {
      const response = await fetch(
        `/api/serie?search=${encodeURIComponent(search)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch series");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSeasons = (id: string) => {
  return useQuery({
    queryKey: ["seasons", id],
    queryFn: async (): Promise<Season[]> => {
      const response = await fetch(`/api/serie/${id}/season`);
      if (!response.ok) throw new Error("Failed to fetch seasons");
      return response.json();
    },
  });
};

export const useVideos = (id: string) => {
  return useQuery({
    queryKey: ["videos", id],
    queryFn: async (): Promise<Video[]> => {
      const response = await fetch(`/api/serie/${id}/video`);
      if (!response.ok) throw new Error("Failed to fetch videos");
      return response.json();
    },
  });
};
