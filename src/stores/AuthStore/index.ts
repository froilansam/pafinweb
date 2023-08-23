import { makeAutoObservable } from "mobx";
import React from "react";
import {
  sendDeleteRequest,
  sendGetRequest,
  sendPatchRequest,
  sendPostRequest,
} from "../../api";
import { makePersistable } from "mobx-persist-store";

// Interface for user credentials during authentication or user creation.
interface ICredentials {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

// Interface for editing a user's information.
export interface IEditUser {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// Interface for user information.
export interface IUsers {
  id?: string;
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

// MobX store class for managing authentication and user-related actions.
class AuthStore {
  token = ""; // The authentication token.
  user: Partial<Omit<IUsers, "password">> = {}; // The authenticated user's information (excluding password).
  users: IUsers[] = []; // List of all users.

  constructor() {
    makeAutoObservable(this);

    // Make the "token" and "user" properties of this store persist in local storage.
    makePersistable(this, {
      name: "AuthStore",
      properties: ["token", "user"],
      storage: window.localStorage,
    });
  }

  // Authenticates a user with the provided credentials.
  authenticateUser = async (credentials: ICredentials) => {
    try {
      const {
        data: { token },
      } = await sendPostRequest<{ token: string }>("/login", {}, credentials);

      this.token = token;
    } catch (error) {
      // @ts-ignore
      throw error;
    }
  };

  // Creates a new user with the provided credentials.
  createUser = async (credentials: ICredentials) => {
    try {
      await sendPostRequest<{ message: string }>("/user", {}, credentials);

      return true;
    } catch (error) {
      throw error;
    }
  };

  // Logs out the current user by clearing token and user information.
  logout = () => {
    this.token = "";
    this.user = {};
  };

  // Fetches all users' information from the server.
  getAllUsers = async () => {
    const response = await sendGetRequest<IUsers[]>("/users", {}, this.token);
    this.users = response.data ?? [];
  };

  // Fetches the authenticated user's information from the server.
  getUser = async () => {
    try {
      if (!this.token) return new Error("No token found.");
      const response = await sendGetRequest<Partial<Omit<IUsers, "password">>>(
        "/user",
        {},
        this.token
      );

      this.user = response.data;
    } catch (error) {
      throw error;
    }
  };

  // Deletes the authenticated user's account.
  deleteUser = async () => {
    try {
      if (!this.token) return new Error("No token found.");
      await sendDeleteRequest("/user", {}, {}, this.token);

      this.logout();

      return true;
    } catch (error) {
      return false;
    }
  };

  // Edits the authenticated user's information using the provided data.
  editUser = async (body: IEditUser) => {
    try {
      if (!this.token) return new Error("No token found.");
      await sendPatchRequest("/user", {}, body, this.token);
      return true;
    } catch (error) {
      throw error;
    }
  };
}

const authStore = new AuthStore();

const AuthContext = React.createContext(authStore);

// Custom hook for accessing the AuthStore instance.
export const useAuthStore = () => React.useContext(AuthContext);

export default authStore;
