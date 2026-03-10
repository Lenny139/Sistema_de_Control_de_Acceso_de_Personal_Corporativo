import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/report/application/**/*.ts',
    'src/report/domain/**/*.ts',
    'src/employee/domain/model/HorarioLaboral.ts',
    'src/access-record/application/**/*.ts',
    'src/access-record/domain/model/**/*.ts',
    'src/auth/application/service/AuthService.ts',
    'src/auth/application/usecase/AuthUsecase.ts',
    'src/auth/domain/model/AbstractUsuario.ts',
    'src/auth/domain/model/Usuario.ts',
    'src/auth/domain/model/ERole.ts',
    '!src/index.ts',
    '!**/*.d.ts',
  ],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { diagnostics: false }],
  },
  moduleNameMapper: {
    '^uuid$': '<rootDir>/src/__tests__/mocks/uuid.ts',
  },
};

export default config;
