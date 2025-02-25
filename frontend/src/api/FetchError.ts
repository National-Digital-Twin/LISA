export class FetchError extends Error {
  status?: number;

  redirectUrl?: string;

  constructor(message: string, status: number, redirectUrl?: string, options?: ErrorOptions) {
    super(message, options);
    this.status = status;
    this.redirectUrl = redirectUrl;
  }
}
