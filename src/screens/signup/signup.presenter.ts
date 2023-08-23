import { makeAutoObservable } from "mobx";
import React from "react";
import authStore from "../../stores/AuthStore";
import { validateEmailFormat, validatePassword } from "../../utils/helpers";

// Presenter class for managing the sign-up process.
class SignUpPresenter {
  name = "";
  email = "";
  password = "";
  confirmPassword = "";
  errors = {
    name: "",
    email: "",
    password: [] as string[], // Array to store multiple password validation errors.
  };

  constructor() {
    makeAutoObservable(this);
  }

  // Get the authentication token from the AuthStore.
  get token() {
    return authStore.token;
  }

  // Update a field value and trigger its validation.
  setValue = (
    key: "name" | "email" | "password" | "confirmPassword",
    value: string
  ) => {
    this[key] = value;
    this.validateField(key);
  };

  // Validate the 'name' field.
  validateName = () => {
    if (this.name === "") {
      this.errors.name = "Full Name is required.";
    } else {
      this.errors.name = "";
    }
  };

  // Validate the 'email' field.
  validateEmail = () => {
    if (this.email === "") {
      this.errors.email = "Email address is required.";
    } else if (!validateEmailFormat(this.email)) {
      this.errors.email = "Invalid Email Address format.";
    } else {
      this.errors.email = "";
    }
  };

  // Validate the 'password' and 'confirmPassword' fields.
  validatePasswordFields = () => {
    if (!this.password && !this.confirmPassword) {
      this.errors.password = ["Please type your desired password."];
      return;
    }

    const validationResult = validatePassword(
      this.password,
      this.confirmPassword
    );

    this.errors.password = validationResult.valid
      ? []
      : validationResult.data ?? [];
  };

  // Validate a specific field based on its key.
  validateField = (key: "name" | "email" | "password" | "confirmPassword") => {
    switch (key) {
      case "name":
        this.validateName();
        break;
      case "email":
        this.validateEmail();
        break;
      case "password":
      case "confirmPassword":
        this.validatePasswordFields();
        break;
    }
  };

  // Perform the sign-up process.
  signUp = async (): Promise<boolean> => {
    try {
      const { email, name, password, confirmPassword } = this;

      this.validateField("password");
      this.validateField("email");
      this.validateField("name");

      // Check for validation errors before proceeding with sign-up.
      if (
        this.errors.name !== "" ||
        this.errors.email !== "" ||
        !!this.errors.password.length
      ) {
        return false;
      }

      // Call the AuthStore's createUser method to register a new user.
      await authStore.createUser({
        email,
        name,
        password,
        confirmPassword,
      });

      return true; // Sign-up was successful.
    } catch (error) {
      //@ts-ignore
      if (error?.response?.data?.code === "EMAIL_ALREADY_TAKEN") {
        this.errors.email =
          "Email address has already taken. Please choose another email.";
      }
      return false;
    }
  };
}

// Create an instance of the SignUpPresenter class.
export const signUpPresenter = new SignUpPresenter();

const SignUpPresenterContext = React.createContext(signUpPresenter);

// Custom hook for accessing the SignUpPresenter instance.
export const useSignUpPresenter = () =>
  React.useContext(SignUpPresenterContext);

export default SignUpPresenterContext;
