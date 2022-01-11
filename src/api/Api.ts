import {
  serializeOrganisation,
  serializePatient,
  serializeProgram,
  serializeUser,
} from "./serializers";
import { RawEndpointData } from "../types/RawEndpointData";
import { Medication, Symptom, Tokens } from "src/types";
import { stringify } from "query-string";

type Params = Record<string, string | number | boolean>;

type Respond<T> = Promise<{
  data: T;
  headers: Headers;
}>;

class Fetch {
  private apiEndpoint: string;
  constructor(apiEndpoint: string, private accessToken: string | null) {
    this.apiEndpoint = apiEndpoint.replace(/\/$/, "");
  }

  private getUrl(endpoint: string) {
    const value = endpoint[0] === "/" ? endpoint : `/${endpoint}`;
    return `${this.apiEndpoint}${value}`;
  }

  post<T>(url: string, data?: any, options?: { token?: string }) {
    return Fetch.post<T>(this.getUrl(url), data, {
      token: this.accessToken || "",
      ...options,
    });
  }

  get<T>(url: string, options?: { params?: Params }) {
    return Fetch.get<T>(this.getUrl(url), {
      token: this.accessToken || "",
      ...options,
    });
  }

  static async post<T>(
    url: string,
    data?: any,
    options?: { token?: string }
  ): Respond<T> {
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    if (options?.token) headers.set("Authorization", `Bearer ${options.token}`);
    return fetch(url, {
      method: "POST",
      referrerPolicy: "no-referrer",
      headers,
      body: JSON.stringify(data || {}),
    }).then(async (res) => ({
      data: await res.json(),
      headers: res.headers,
    }));
  }
  static async get<T>(
    url: string,
    options?: { token?: string; params?: Params }
  ): Respond<T> {
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    if (options?.token) headers.set("Authorization", `Bearer ${options.token}`);
    const queryData = options?.params ? stringify(options?.params) : "";
    const query = queryData ? `?${queryData}` : "";
    return fetch(`${url}${query}`, {
      method: "GET",
      referrerPolicy: "no-referrer",
      headers,
    }).then(async (res) => ({
      data: await res.json(),
      headers: res.headers,
    }));
  }
}

export class Api {
  private fetch: Fetch;
  constructor(private apiEndpoint: string, private tokens: Tokens) {
    this.fetch = new Fetch(this.apiEndpoint, this.tokens.accessToken);
  }
  get hasAccessToken() {
    return !!this.tokens.accessToken;
  }
  async login(creds: { email: string; password: string }) {
    const {
      data: { accessToken, refreshToken, user },
    } = await this.fetch.post<RawEndpointData["/auth/login"]>(
      `/auth/login`,
      creds
    );
    const tokens = {
      accessToken,
      refreshToken,
    };
    return {
      tokens,
      user: serializeUser(user),
    };
  }
  async getUser() {
    // Question this should have Application/json
    const payload = await this.fetch.get<RawEndpointData["/current"]>(
      `/current`
    );
    return {
      user: serializeUser(payload.data),
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
    const totalCount = parseInt(payload.headers.get("x-total-count") || "");
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
    const totalCount = parseInt(payload.headers.get("x-total-count") || "");
    const programs = payload.data.map(serializeProgram);
    return {
      totalCount,
      programs,
    };
  }
  async getProgram(programId: string) {
    const payload = await this.fetch.get<
      RawEndpointData["/admin/projects/:projectId"]
    >(`admin/projects/${programId}`);
    return { payload, data: serializeProgram(payload.data) };
  }
  async refetchAccessToken() {
    const { refreshToken } = this.tokens;
    if (!refreshToken) return { accessToken: null };
    const {
      data: { accessToken },
    } = await this.fetch.post<RawEndpointData["/auth/refresh"]>(
      `/auth/refresh`,
      {},
      { token: refreshToken }
    );
    return {
      accessToken,
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
    const totalCount = parseInt(payload.headers.get("x-total-count") || "");
    return {
      totalCount,
      patients: payload.data.map(serializePatient),
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
  async getMedications({
    programId,
    startDate,
    endDate,
  }: {
    programId: string;
    startDate: Date;
    endDate: Date;
  }) {
    const { data } = await this.fetch.get<
      RawEndpointData["/pro-dashboard/projects/:projectId/reports/medication"]
    >(`/pro-dashboard/projects/${programId}/reports/medication`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    return data;
  }

  async getSymptomps({
    programId,
    startDate,
    endDate,
  }: {
    programId: string;
    startDate: Date;
    endDate: Date;
  }) {
    const { data } = await this.fetch.get<
      RawEndpointData["/pro-dashboard/projects/:projectId/reports/symptoms"]
    >(`/pro-dashboard/projects/${programId}/reports/symptoms`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    return data;
  }

  async logout() {
    return this.fetch.post("auth/logout");
  }
}
