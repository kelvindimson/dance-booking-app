import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useRoles = () => {
  const queryClient = useQueryClient();

  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await axios.get("/api/roles");
      return response.data.data;
    },
  });

  const createRole = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const response = await axios.post("/api/roles", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  const updateRole = useMutation({
    mutationFn: async (data: { id: string; name: string; description?: string }) => {
      const response = await axios.patch("/api/roles", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  const deleteRole = useMutation({
    mutationFn: async (data: { id: string }) => {
      const response = await axios.delete("/api/roles", { data });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  return {
    roles,
    isLoading,
    createRole,
    updateRole,
    deleteRole,
  };
};