import React from "react";
import { useLocation } from "react-router-dom";

// Interfaces

/**
 * Interface for defining password validation rules.
 */
interface IPasswordValidationRule {
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
  ErrorMessage: string;
}

/**
 * Adds an object to the result if the given condition is true.
 *
 * @param {boolean} cond - The condition to check.
 * @param {object} obj - The object to add to the result.
 * @returns {object} The object if the condition is true, otherwise an empty object.
 */
export const addObjectIf = (cond: boolean, obj: object) =>
  cond ? { ...obj } : {};

/**
 * A custom hook that builds on useLocation to parse
 * the query string for you.
 *
 * @returns {URLSearchParams} The parsed query parameters as URLSearchParams object.
 */
export const useQuery = () => {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
};

/**
 * Validates the format of an email address using a regular expression.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} true if the email format is valid, otherwise false.
 */
export const validateEmailFormat = (email: string) => {
  let regex = new RegExp("[a-z0-9]+@[a-z]+\\.[a-z]{1,3}");
  return regex.test(email);
};

/**
 * Validates the provided password against a set of password validation rules.
 *
 * @param {string} password - The password to validate.
 * @param {string} confirmPassword - The confirmation password for comparison.
 * @param {IPasswordValidationRule[]} passwordValidDefinition - An array of password validation rules.
 * @returns {{valid: boolean, data: string[]}} An object indicating if the password is valid and any error messages.
 */
export const validatePassword = (password: string, confirmPassword: string) => {
  // Define an array of password validation rules.
  var passwordValidDefinition: IPasswordValidationRule[] = [
    {
      // Rule: Password must be at least six characters long.
      minLength: 6,
      ErrorMessage: "Your password must be at least six characters long.",
    },
    {
      // Rule: Password cannot be longer than 50 characters.
      maxLength: 50,
      ErrorMessage: "Your password cannot be longer than 50 characters.",
    },
    {
      // Rule: Password must contain at least one digit.
      regex: /.*\d/,
      ErrorMessage: "Your password must contain at least one digit.",
    },
    {
      // Rule: Password must contain at least one letter.
      regex: /.*[a-zA-Z]/,
      ErrorMessage: "Your password must contain at least one letter.",
    },
    {
      // Rule: Password must contain at least one symbol in the specified list or a space.
      regex: /.*[!@#$%^&*() =+_-]/,
      ErrorMessage:
        "Your password must contain at least one symbol in this list !@#$%^&*()=+_- or a space.",
    },
  ];

  const errors = [];

  // Check if the provided password matches the confirmation password.
  if (password !== confirmPassword) {
    errors.push("The confirmation password does not match.");
  }

  // Loop through each password validation rule defined in passwordValidDefinition.
  for (var i = 0; i < passwordValidDefinition.length; i++) {
    var validator: IPasswordValidationRule = passwordValidDefinition[i];
    var valid = true;

    // Check if the rule has a regular expression property (regex).
    if (validator.hasOwnProperty("regex")) {
      // Test if the password matches the regular expression.
      if (password.search(validator.regex as RegExp) < 0) valid = false;
    }

    // Check if the rule has a minimum length property (minLength).
    if (validator.hasOwnProperty("minLength")) {
      // Check if the password length is less than the required minimum length.
      if (password.length < (validator.minLength as number)) valid = false;
    }

    // Check if the rule has a maximum length property (maxLength).
    if (validator.hasOwnProperty("maxLength")) {
      // Check if the password length is greater than the allowed maximum length.
      if (password.length > (validator.maxLength as number)) valid = false;
    }

    // If any of the validation checks failed for the current rule, add its error message to the errors array.
    if (!valid) errors.push(validator.ErrorMessage);
  }

  // If there are any errors, return an object indicating that the password is not valid along with the error messages.
  if (errors.length > 0) {
    return { valid: false, data: errors };
  }

  // If no errors were found, return an object indicating that the password is valid and no error messages.
  return { valid: true, data: [] };
};
