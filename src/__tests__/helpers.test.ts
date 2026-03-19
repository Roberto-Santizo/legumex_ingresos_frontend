/**
 * Pruebas de utilidades del frontend.
 *
 * Corre con Vitest (compatible con Jest API).
 * Para instalarlo: npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
 * Agregar en vite.config.ts:  test: { environment: 'jsdom' }
 */

import { describe, it, expect } from 'vitest'
import { toUpper } from '../shared/helpers/textTransformUppercase'

// ── toUpper ────────────────────────────────────────────────────────────────────

describe('toUpper', () => {
    it('convierte un string a mayúsculas', () => {
        expect(toUpper('hola mundo')).toBe('HOLA MUNDO')
    })

    it('no modifica un string ya en mayúsculas', () => {
        expect(toUpper('HOLA')).toBe('HOLA')
    })

    it('convierte cadena con tildes y caracteres especiales', () => {
        expect(toUpper('josé garcía')).toBe('JOSÉ GARCÍA')
    })

    it('devuelve el mismo valor si no es string (número)', () => {
        expect(toUpper(42)).toBe(42)
    })

    it('devuelve el mismo valor si no es string (null)', () => {
        expect(toUpper(null)).toBe(null)
    })

    it('devuelve el mismo valor si no es string (undefined)', () => {
        expect(toUpper(undefined)).toBe(undefined)
    })

    it('maneja string vacío', () => {
        expect(toUpper('')).toBe('')
    })
})
