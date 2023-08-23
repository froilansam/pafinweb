// counterStore.ts
import { makeAutoObservable, reaction } from "mobx";
import React from "react";
import authStore, { IUsers } from "../../stores/AuthStore";
import {
  addObjectIf,
  validateEmailFormat,
  validatePassword,
} from "../../utils/helpers";
import { toast } from "react-toastify";

class DashboardPresenter {
  constructor() {
    makeAutoObservable(this);
    reaction(
      () => authStore?.user,
      (user: Partial<Omit<IUsers, "password">>) => {
        console.log({ user });
        this.setValue("name", user?.name as string);
        this.setValue("email", user?.email as string);
      }
    );
  }

  anchorElUser: null | HTMLElement = null;
  settings = [
    {
      text: "Logout",
      handleClick: () => {
        this.handleCloseUserMenu();
        this.logout();
      },
    },
  ];
  isEditing = false;
  open = false;
  name = "";
  email = "";
  currentPassword = "";
  newPassword = "";
  confirmPassword = "";
  errors: { name: string; email: string; password: string[] } = {
    name: "",
    email: "",
    password: [],
  };

  get user() {
    return authStore.user;
  }

  setIsEditing = (isEditing: boolean) => {
    this.isEditing = isEditing;
  };

  setValue = (
    key:
      | "name"
      | "email"
      | "currentPassword"
      | "confirmPassword"
      | "newPassword",
    value: string
  ) => {
    this[key] = value;
    this.validateField(key);
  };

  setAnchorElUser = (anchorElUser: null | HTMLElement) => {
    this.anchorElUser = anchorElUser;
  };

  handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setAnchorElUser(event.currentTarget);
  };

  handleCloseUserMenu = () => {
    this.setAnchorElUser(null);
  };

  logout = async () => {
    try {
      await authStore.logout();
    } catch (e) {
      console.log(e);
    }
  };

  getUser = async () => {
    try {
      await authStore.getUser();
    } catch (error) {
      console.log(error);
    }
  };

  deleteUser = async () => {
    try {
      const success = await authStore.deleteUser();

      this.open = false;
      return success;
    } catch (error) {
      toast.error("There is a problem deleting your account.");
      this.open = false;
    }
  };

  editUser = async () => {
    try {
      if (
        this.errors.name !== "" ||
        this.errors.email !== "" ||
        !!this.errors.password.length
      ) {
        return false;
      }

      await authStore.editUser({
        name: this.name,
        email: this.email,
        ...addObjectIf(!!this.confirmPassword, {
          confirmPassword: this.confirmPassword,
        }),
        ...addObjectIf(!!this.currentPassword, {
          currentPassword: this.currentPassword,
        }),
        ...addObjectIf(!!this.newPassword, {
          newPassword: this.newPassword,
        }),
      });

      this.confirmPassword = "";
      this.newPassword = "";
      this.currentPassword = "";

      this.setIsEditing(false);

      toast.success("User info updated succesfully!");
    } catch (error) {
      //@ts-ignore
      if (error?.response?.data?.code === "EMAIL_ALREADY_TAKEN") {
        this.errors.email =
          "Email address has already taken. Please choose another email.";
      }
      //@ts-ignore
      if (error?.response?.data?.code === "CURRENT_PASSWORD_NOT_MATCH") {
        this.errors.password = [
          "Your current password does not match the record.",
        ];
      }
    }
  };

  setOpen = (open: boolean) => {
    this.open = open;
  };

  handleClickOpen = () => {
    this.setOpen(true);
  };

  handleClose = () => {
    this.setOpen(false);
  };

  validateField = (
    key:
      | "name"
      | "email"
      | "currentPassword"
      | "confirmPassword"
      | "newPassword"
  ) => {
    switch (key) {
      case "name":
        this.validateName();
        break;
      case "email":
        this.validateEmail();
        break;
      case "currentPassword":
      case "newPassword":
      case "confirmPassword":
        this.validatePasswordFields();
        break;
    }
  };

  validateName = () => {
    this.errors.name = this.name === "" ? "Full Name is required." : "";
  };

  validateEmail = () => {
    if (this.email === "") {
      this.errors.email = "Email address is required.";
    } else if (!validateEmailFormat(this.email)) {
      this.errors.email = "Invalid Email Address format.";
    } else {
      this.errors.email = "";
    }
  };

  validatePasswordFields = () => {
    const { confirmPassword, currentPassword, newPassword } = this;
    this.errors.password = [];

    if (!confirmPassword && !currentPassword && !newPassword) {
      return; // No need to set errors if all password fields are empty
    }

    if (!currentPassword && (confirmPassword || newPassword)) {
      this.errors.password.push("Please type your current password.");
    }

    if (!newPassword && (confirmPassword || currentPassword)) {
      this.errors.password.push("Please type your new desired password.");
    }

    if (!!newPassword || !!confirmPassword) {
      const validationResult = validatePassword(newPassword, confirmPassword);

      if (!validationResult.valid) {
        this.errors.password.push(...(validationResult.data ?? []));
      }
    }
  };
}

export const dashboardPresenter = new DashboardPresenter();

const DashboardPresenterContext = React.createContext(dashboardPresenter);

export const useDashboardPresenter = () =>
  React.useContext(DashboardPresenterContext);

export default DashboardPresenterContext;
