import { makeAutoObservable } from "mobx";
import React from "react";
import authStore from "../../stores/AuthStore";

// Presenter class for managing the login process.
class LoginPresenter {
  constructor() {
    makeAutoObservable(this); // Enables MobX to automatically generate observables for state management.
  }

  // Get the authentication token from the AuthStore.
  get token() {
    return authStore.token;
  }

  // Attempt to authenticate the user with the provided credentials.
  login = async (credentials: { email: string; password: string }) => {
    try {
      await authStore.authenticateUser(credentials); // Call the AuthStore's authenticateUser method.

      return true; // Login was successful.
    } catch (e) {
      return false; // Login failed.
    }
  };
}

// Create an instance of the LoginPresenter class.
export const loginPresenter = new LoginPresenter();

// Create a React context for the LoginPresenter instance.
const LoginPresenterContext = React.createContext(loginPresenter);

// Custom hook for accessing the LoginPresenter instance within components.
export const useLoginPresenter = () => React.useContext(LoginPresenterContext);

export default LoginPresenterContext; // Export the context as the default export.
