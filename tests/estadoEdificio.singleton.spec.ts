import { describe, expect, it } from '@jest/globals';
import { EstadoEdificio } from '../src/frontend/js/models/EstadoEdificio';

describe('EstadoEdificio Singleton', () => {
  it('returns the same instance', () => {
    const first = EstadoEdificio.getInstance();
    const second = EstadoEdificio.getInstance();

    expect(first).toBe(second);
  });
});
