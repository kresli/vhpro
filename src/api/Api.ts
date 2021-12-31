import axios, { AxiosInstance } from "axios";
import {
  serializeOrganisation,
  serializePatient,
  serializeProgram,
  serializeUser,
} from "./serializers";
import { RawEndpointData } from "../types/RawEndpointData";
import { Tokens } from "src/types";

export class Api {
  private fetch: AxiosInstance;
  private tokens: Tokens | null = null;
  constructor(
    private apiEndpoint: string,
    private onTokensUpdate: (tokens: Tokens) => void
  ) {
    this.fetch = Api.createAxios(apiEndpoint, null);
  }
  setTokens(tokens: Tokens) {
    this.tokens = tokens;
    this.fetch = axios.create({
      baseURL: this.apiEndpoint,
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    this.onTokensUpdate(this.tokens);
  }
  private static createAxios(apiEndpoint: string, accessToken: string | null) {
    return axios.create({
      baseURL: apiEndpoint,
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        "Access-Control-Allow-Origin": "*",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });
  }
  async login(creds: { email: string; password: string }) {
    const payload = await axios.post<RawEndpointData["/auth/login"]>(
      `${this.apiEndpoint}/auth/login`,
      creds
    );
    this.tokens = {
      accessToken: payload.data.accessToken,
      refreshToken: payload.data.refreshToken,
    };
    this.setTokens(this.tokens);
    return {
      payload,
      data: {
        ...payload.data,
        user: serializeUser(payload.data.user),
      },
    };
  }
  async getUser() {
    const payload = await axios.get<RawEndpointData["/current"]>(
      `${this.apiEndpoint}/current`,
      { headers: { Authorization: `Bearer ${this.tokens?.accessToken}` } }
    );
    return {
      payload,
      data: serializeUser(payload.data),
    };
  }
  async getOrganisations({
    page = 1,
    perPage = 25,
    term = "",
  }: {
    page?: number;
    perPage?: number;
    term?: string;
  }) {
    const endpoint = "/admin/organisations" as const;
    const payload = await this.fetch.get<RawEndpointData[typeof endpoint]>(
      endpoint,
      {
        params: {
          _page: page,
          _perPage: perPage,
          term,
        },
      }
    );
    const organisations = payload.data.map(serializeOrganisation);
    const totalCount = parseInt(payload.headers["x-total-count"]);
    return {
      organisations,
      totalCount,
    };
  }
  async getOrganisation(organisationId: string) {
    const payload = await this.fetch.get<
      RawEndpointData["/admin/organisations/:organisationId"]
    >(`admin/organisations/${organisationId}`);
    return { payload, data: serializeOrganisation(payload.data) };
  }
  async getPrograms({
    page = 1,
    perPage = 25,
    term = "",
    organisationId,
  }: {
    page?: number;
    perPage?: number;
    term?: string;
    organisationId: string;
  }) {
    const payload = await this.fetch.get<RawEndpointData["/admin/projects"]>(
      "admin/projects",
      {
        params: {
          _page: page,
          _perPage: perPage,
          organisationId,
          term,
        },
      }
    );
    return {
      payload,
      data: payload.data.map(serializeProgram),
    };
  }
  async getProgram(programId: string) {
    const payload = await this.fetch.get<
      RawEndpointData["/admin/projects/:projectId"]
    >(`admin/projects/${programId}`);
    return { payload, data: serializeProgram(payload.data) };
  }
  async refetchAccessToken() {
    const payload = await axios.post<RawEndpointData["/auth/refresh"]>(
      `${this.apiEndpoint}/auth/refresh`,
      {},
      { headers: { Authorization: `Bearer ${this.tokens?.refreshToken}` } }
    );
    this.setTokens({
      accessToken: payload.data.accessToken,
      refreshToken: this.tokens?.refreshToken || null,
    });
    return {
      payload,
    };
  }
  async getPatients({
    page = 1,
    perPage = 25,
    term = "",
    consentedOnly = false,
    programId,
  }: {
    page?: number;
    perPage?: number;
    term?: string;
    consentedOnly?: boolean;
    programId: string;
  }) {
    const payload = await this.fetch.get<
      RawEndpointData["/admin/projects/:projectId/users"]
    >(`/admin/projects/${programId}/users`, {
      params: {
        _page: page,
        _perPage: perPage,
        term,
        consentedOnly,
      },
    });
    return {
      payload,
      data: payload.data.map(serializePatient),
    };
  }
  async getPatient({
    participantId,
    programId,
  }: {
    participantId: string;
    programId: string;
  }) {
    const payload = await this.fetch.get<
      RawEndpointData["/admin/projects/:projectId/users/:patientId"]
    >(`admin/projects/${programId}/users/${participantId}`);
    return { payload, data: serializePatient(payload.data) };
  }
}
