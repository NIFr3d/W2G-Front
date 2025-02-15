import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Serie } from "./types";

const fetchSeries = async (): Promise<Serie[]> => {
  const response = await fetch("/api/serie");
  if (!response.ok) {
    throw new Error("Failed to fetch series");
  }
  return response.json();
};

const addSeries = async (formData: FormData): Promise<void> => {
  const response = await fetch("/api/serie", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to add series");
  }
};

const deleteSeries = async (id: number): Promise<void> => {
  const response = await fetch(`/api/serie/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete series");
  }
};

export const useSeries = () => {
  return useQuery({ queryKey: ["series"], queryFn: fetchSeries });
};

export const useAddSeries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addSeries,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
    },
  });
};

export const useDeleteSeries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSeries,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
    },
  });
};
