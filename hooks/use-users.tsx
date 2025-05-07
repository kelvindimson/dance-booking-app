/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

// interface User {
//   id: string;
//   name: string | null;
//   email: string;
//   status: string;
//   roles: string[];
// }

interface CreateUserData {
  email: string;
  name?: string;
  status?: string;
  roleIds?: string[];
}

interface UpdateUserData {
  id: string;
  email?: string;
  name?: string;
  status?: string;
  roleIds?: string[];
  password?: string;
}

export const useUsers = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/users");
        if (!response.data.success) {
          throw new Error(response.data.message);
        }
        return response.data.data;
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch users");
        throw error;
      }
    }
  });

  const createUser = useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await axios.post("/api/users", data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data.message || "User created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create user");
    }
  });

  const updateUser = useMutation({
    mutationFn: async (data: UpdateUserData) => {
      const response = await axios.patch("/api/users", data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data.message || "User updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  });

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete("/api/users", { data: { id } });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data.message || "User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  });

  const getUserById = async (id: string) => {
    try {
      const response = await axios.get(`/api/users?id=${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch user");
      throw error;
    }
  };

  return {
    users,
    isLoading,
    createUser,
    updateUser,
    deleteUser,
    getUserById
  };
};