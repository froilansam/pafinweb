import axios, { AxiosInstance, AxiosResponse } from "axios";
import { addObjectIf } from "../utils/helpers";

const baseUrl = "http://localhost:3000";

// Create an Axios instance with custom configuration.
const instance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// Converts an object of parameters to a query string.
export const toQueryString = (params: {
  [key: string]: string | number | boolean;
}): string =>
  "?" +
  Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

// Builds the complete URL for a request, including optional query string.
export const getBaseUrl = (route: string, queryString?: string): string =>
  `${baseUrl}${route}${queryString || ""}`;

// Sends a request with the given parameters.
const sendRequest = async <Response>(
  method: "get" | "post" | "delete" | "patch",
  requestURL: string,
  params: { [key: string]: string | number | boolean },
  body?: { [key: string]: any },
  token?: string
): Promise<AxiosResponse<Response>> => {
  try {
    if (params) {
      const queryString = toQueryString(params);
      requestURL = getBaseUrl(requestURL, queryString);
    }

    const config: any = {
      method,
      url: requestURL,
      maxBodyLength: Infinity,
      ...addObjectIf(!!token, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    };

    if (body) {
      config.data = JSON.stringify(body);
    }

    // Send the request using the Axios instance.
    const response = await instance.request<Response>(config);

    return response;
  } catch (error) {
    throw error;
  }
};

// Functions for sending different types of requests using sendRequest function.

// Sends a GET request.
export const sendGetRequest = <Response>(
  requestURL: string,
  params: { [key: string]: string | number | boolean },
  token?: string
): Promise<AxiosResponse<Response>> =>
  sendRequest<Response>("get", requestURL, params, undefined, token);

// Sends a POST request.
export const sendPostRequest = <Response>(
  requestURL: string,
  params: { [key: string]: string | number | boolean },
  body: { [key: string]: any },
  token?: string
): Promise<AxiosResponse<Response>> =>
  sendRequest<Response>("post", requestURL, params, body, token);

// Sends a DELETE request.
export const sendDeleteRequest = <Response>(
  requestURL: string,
  params: { [key: string]: string | number | boolean },
  body: { [key: string]: any },
  token: string
): Promise<AxiosResponse<Response>> =>
  sendRequest<Response>("delete", requestURL, params, body, token);

// Sends a PATCH request.
export const sendPatchRequest = <Response>(
  requestURL: string,
  params: { [key: string]: string | number | boolean },
  body: { [key: string]: any },
  token?: string
): Promise<AxiosResponse<Response>> =>
  sendRequest<Response>("patch", requestURL, params, body, token);
