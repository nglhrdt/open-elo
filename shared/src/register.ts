import type { User } from "./user";

export type RegistrationData = {
    username: string;
    email: string;
    password: string;
}

export type RegistrationResponse = User;