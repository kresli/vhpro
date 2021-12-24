import axios, { Axios } from "axios";
import { RawData } from "./types";

export class Api {
  fetch = axios.create({
    baseURL: "https://staging.api.vinehealth.ai",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      "Access-Control-Allow-Origin": "*",
    },
  });
  async login(data: { email: string; password: string }) {
    return this.fetch.post<RawData["/api/v1/auth/login"]>(
      "/api/v1/auth/login",
      data
    );
  }
}
