import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Season, Serie, Video } from "../types";

export const useSeries = () => {
  return useQuery({
    queryKey: ["series"],
    queryFn: async (): Promise<Serie[]> => {
      const response = await fetch("/api/serie");
      if (!response.ok) {
        throw new Error("Failed to fetch series");
      }
      return response.json();
    },
  });
};

export const useAddSeries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData): Promise<void> => {
      const response = await fetch("/api/serie", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to add series");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
    },
  });
};

export const useDeleteSeries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const response = await fetch(`/api/serie/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete series");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
    },
  });
};

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

export const useUpdateSerie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/serie/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["serie", id] });
      queryClient.invalidateQueries({ queryKey: ["series"] });
    },
  });
};

export const useAddSeason = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/serie/${id}/season`, {
        method: "POST",
      });
      if (!response.ok) throw new Error(await response.text());
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["seasons", id] });
    },
  });
};

export const useRemoveSeason = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      serieId,
      seasonId,
    }: {
      serieId: string;
      seasonId: number;
    }) => {
      const response = await fetch(`/api/serie/${serieId}/season/${seasonId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(await response.text());
    },
    onSuccess: (_data, { serieId }) => {
      queryClient.invalidateQueries({ queryKey: ["seasons", serieId] });
    },
  });
};

export const useSaveThumbnail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const response = await fetch(`/api/serie/${id}/thumbnail`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(await response.text());
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["serie", id] });
    },
  });
};

export const useAddVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      seasonNumber,
      formData,
    }: {
      id: string;
      seasonNumber: number;
      formData: FormData;
    }) => {
      const response = await fetch(
        `/api/serie/${id}/season/${seasonNumber}/video`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error(await response.text());
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["videos", id] });
    },
  });
};

export const useRemoveVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      seasonId,
      videoId,
    }: {
      id: string;
      seasonId: number;
      videoId: number;
    }) => {
      const response = await fetch(
        `/api/serie/${id}/season/${seasonId}/video/${videoId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error(await response.text());
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["videos", id] });
    },
  });
};

export const useEditSeasonNumber = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      serieId,
      seasonId,
      newNumber,
    }: {
      serieId: string;
      seasonId: number;
      newNumber: number;
    }) => {
      const response = await fetch(
        `/api/serie/${serieId}/season/${seasonId}?number=${newNumber}`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error(await response.text());
    },
    onSuccess: (_data, { serieId }) => {
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
      queryClient.invalidateQueries({ queryKey: ["videos", serieId] });
    },
  });
};
