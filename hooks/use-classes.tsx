/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
// import { classStatusEnum } from "@/db/schema";
import { classStatusEnum } from "@/global";


interface CreateClassData {
  studioId: string;
  roomId: string;
  primaryInstructorId: string;
  name: string;
  description?: string;
  type: string;
  level?: string;
  capacity: number;
  price: number;
  duration: number;
  startTime: Date;
  endTime: Date;
  recurring?: boolean;
  recurrencePattern?: string;
  status?: classStatusEnum;
}

type UpdateClassData = Partial<CreateClassData> & { id: string };

export const useClasses = () => {
  const queryClient = useQueryClient();

  const { data: classes, isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/classes");
        if (!response.data.success) {
          throw new Error(response.data.message);
        }
        return response.data.data;
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch classes");
        throw error;
      }
    }
  });

  const createClass = useMutation({
    mutationFn: async (data: CreateClassData) => {
      const response = await axios.post("/api/classes", data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success(data.message || "Class created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create class");
    }
  });

  const updateClass = useMutation({
    mutationFn: async (data: UpdateClassData) => {
      const response = await axios.patch("/api/classes", data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success(data.message || "Class updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update class");
    }
  });

  const deleteClass = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete("/api/classes", { data: { id } });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success(data.message || "Class deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete class");
    }
  });

  const getClassById = async (id: string) => {
    try {
      const response = await axios.get(`/api/classes?id=${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch class");
      throw error;
    }
  };

  return {
    classes,
    isLoading,
    createClass,
    updateClass,
    deleteClass,
    getClassById
  };
};