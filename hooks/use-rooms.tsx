/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

interface CreateRoomData {
  studioId: string;
  name: string;
  description?: string;
  capacity: number;
  amenities?: string;
}

type UpdateRoomData = Partial<CreateRoomData> & { id: string };

export const useRooms = (studioId?: string) => {
  const queryClient = useQueryClient();

  const { data: rooms, isLoading } = useQuery({
    queryKey: ["rooms", studioId],
    queryFn: async () => {
      try {
        const url = studioId ? `/api/rooms?studioId=${studioId}` : '/api/rooms';
        const response = await axios.get(url);
        if (!response.data.success) {
          throw new Error(response.data.message);
        }
        return response.data.data;
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch rooms");
        throw error;
      }
    }
  });

  const createRoom = useMutation({
    mutationFn: async (data: CreateRoomData) => {
      const response = await axios.post("/api/rooms", data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(data.message || "Room created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create room");
    }
  });

  const updateRoom = useMutation({
    mutationFn: async (data: UpdateRoomData) => {
      const response = await axios.patch("/api/rooms", data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(data.message || "Room updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update room");
    }
  });

  const deleteRoom = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete("/api/rooms", { data: { id } });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(data.message || "Room deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete room");
    }
  });

  return {
    rooms,
    isLoading,
    createRoom,
    updateRoom,
    deleteRoom
  };
};