import type { RegistrationData, RegistrationResponse } from "@open-elo/shared";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../api-client";

const register = async (credentials: RegistrationData) => {
  return apiClient.post<RegistrationResponse>(`/register`, credentials);
}

export const useRegister = () => {
  return useMutation({
    mutationFn: (credentials: RegistrationData) => register(credentials),
  });
};
