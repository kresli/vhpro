interface Config {
  apiEndpoint: string;
}
export class Env {
  constructor(private config: Config) {}
  get apiEndpoint() {
    return this.config.apiEndpoint;
  }
}
