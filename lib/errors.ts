export class ConfigError extends Error {
  public readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ConfigError";
    this.code = code;
  }
}

export class UpstreamServiceError extends Error {
  public readonly service: string;
  public readonly status?: number;
  public readonly code?: string;

  constructor(args: { service: string; message: string; status?: number; code?: string }) {
    super(args.message);
    this.name = "UpstreamServiceError";
    this.service = args.service;
    this.status = args.status;
    this.code = args.code;
  }
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new ConfigError("MISSING_ENV", `Missing required environment variable: ${name}`);
  }
  return value;
}

export function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}


