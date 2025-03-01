import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConversionTask, User } from "@/lib/types";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: User) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to add user");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: User) => {
      const response = await fetch(`/api/users/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          role: data.role,
          password: data.password,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async (): Promise<ConversionTask[]> => {
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
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
