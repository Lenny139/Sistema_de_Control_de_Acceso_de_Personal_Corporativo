"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EstadoEdificio_1 = require("../src/frontend/js/models/EstadoEdificio");
describe('EstadoEdificio Singleton', () => {
    it('returns the same instance', () => {
        const first = EstadoEdificio_1.EstadoEdificio.getInstance();
        const second = EstadoEdificio_1.EstadoEdificio.getInstance();
        expect(first).toBe(second);
    });
});
