import { describe, expect, it } from 'vitest';
import {
  litPath,
  PLANET,
  planetArc,
  planetDots,
  planetFraction,
  planetPoint,
} from './sky';

describe('litPath', () => {
  it("n'éclaire rien à la nouvelle lune", () => {
    expect(litPath(0, 10, 10, 5)).toBeNull();
    expect(litPath(-1, 10, 10, 5)).toBeNull();
  });

  it('dessine le disque entier à la pleine lune', () => {
    expect(litPath(1, 10, 10, 5)).toBe(
      'M 10 5 A 5 5 0 1 1 10 15 A 5 5 0 1 1 10 5 Z',
    );
  });

  it('coupe le disque en deux au premier quartier', () => {
    expect(litPath(0.5, 10, 10, 5)).toBe(
      'M 10 5 A 5 5 0 0 1 10 15 A 0.00 5 0 0 0 10 5 Z',
    );
  });

  it('bombe la phase au-delà de la moitié', () => {
    expect(litPath(0.75, 10, 10, 5)).toContain('A 2.50 5 0 0 1');
  });
});

describe('planètes', () => {
  it('pose un point par point, cochés jusqu’à la valeur', () => {
    const { dotted, dots } = planetDots(10, 6);
    expect(dotted).toBe(true);
    expect(dots).toHaveLength(10);
    expect(dots.filter((d) => d.filled)).toHaveLength(6);
    expect(dots[0].filled).toBe(true);
    expect(dots[9].filled).toBe(false);
  });

  it('remplace les points par un trait au-delà de 24', () => {
    expect(planetDots(PLANET.MAX_DOTS, 3).dotted).toBe(true);
    expect(planetDots(PLANET.MAX_DOTS + 1, 3)).toEqual({
      dotted: false,
      dots: [],
    });
    expect(planetDots(0, 0).dotted).toBe(false);
  });

  it('borne la part éclairée entre 0 et 1', () => {
    expect(planetFraction(5, 10)).toBe(0.5);
    expect(planetFraction(12, 10)).toBe(1);
    expect(planetFraction(-2, 10)).toBe(0);
    expect(planetFraction(3, 0)).toBe(0);
  });

  it('place les points sur l’arc ouvert en bas', () => {
    const [x, y] = planetPoint(90);
    expect(x).toBeCloseTo(PLANET.C);
    expect(y).toBeCloseTo(PLANET.C + PLANET.DOTS);
    expect(planetArc(135, 405)).toMatch(/ 0 1 1 /);
    expect(planetArc(135, 200)).toMatch(/ 0 0 1 /);
  });
});
