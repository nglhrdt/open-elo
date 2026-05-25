import type { Credentials, LoginResponse } from "@open-elo/shared";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../api-client";

const login = async (credentials: Credentials) => {
  return apiClient.post<LoginResponse>(`/login`, credentials);
}

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: Credentials) => login(credentials),
  });
};
