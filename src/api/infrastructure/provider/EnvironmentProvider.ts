import fs from 'fs';
import path from 'path';
import { EVariable } from '../../domain/config/EVariable';
import { EnvironmentProviderInterface } from '../../domain/config/EnvironmentProviderInterface';

type EnvironmentConfig = {
  HOST: string;
  PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  DB_PATH: string;
};

export class EnvironmentProvider implements EnvironmentProviderInterface {
  private static instance: EnvironmentProvider;
  private readonly values: EnvironmentConfig;

  private constructor() {
    const envPath = path.resolve(process.cwd(), 'env', 'env.json');
    const raw = fs.readFileSync(envPath, 'utf-8');
    this.values = JSON.parse(raw) as EnvironmentConfig;
  }

  static getInstance(): EnvironmentProvider {
    if (!EnvironmentProvider.instance) {
      EnvironmentProvider.instance = new EnvironmentProvider();
    }

    return EnvironmentProvider.instance;
  }

  getHost(): string {
    return this.values[EVariable.HOST];
  }

  getPort(): number {
    return this.values[EVariable.PORT];
  }

  getJwtSecret(): string {
    return this.values[EVariable.JWT_SECRET];
  }

  getJwtExpiresIn(): string {
    return this.values[EVariable.JWT_EXPIRES_IN];
  }

  getDbPath(): string {
    return this.values[EVariable.DB_PATH];
  }
}
