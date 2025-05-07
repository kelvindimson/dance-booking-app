/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";


interface CreateStudioData {
  name: string;
  handle: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
}

type UpdateStudioData = Partial<CreateStudioData> & { id: string };

export const useStudios = () => {
  const queryClient = useQueryClient();

  const { data: studios, isLoading } = useQuery({
    queryKey: ["studios"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/studios");
        if (!response.data.success) {
          throw new Error(response.data.message);
        }
        return response.data.data;
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch studios");
        throw error;
      }
    }
  });

  const createStudio = useMutation({
    mutationFn: async (data: CreateStudioData) => {
      const response = await axios.post("/api/studios", data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["studios"] });
      toast.success(data.message || "Studio created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create studio");
    }
  });

  const updateStudio = useMutation({
    mutationFn: async (data: UpdateStudioData) => {
      const response = await axios.patch("/api/studios", data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["studios"] });
      toast.success(data.message || "Studio updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update studio");
    }
  });

  const deleteStudio = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete("/api/studios", { data: { id } });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["studios"] });
      toast.success(data.message || "Studio deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete studio");
    }
  });

  const getStudioById = async (id: string) => {
    try {
      const response = await axios.get(`/api/studios?id=${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch studio");
      throw error;
    }
  };

  return {
    studios,
    isLoading,
    createStudio,
    updateStudio,
    deleteStudio,
    getStudioById
  };
};