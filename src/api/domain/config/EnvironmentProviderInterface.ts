export interface EnvironmentProviderInterface {
  getHost(): string;
  getPort(): number;
  getJwtSecret(): string;
  getJwtExpiresIn(): string;
  getDbPath(): string;
}
