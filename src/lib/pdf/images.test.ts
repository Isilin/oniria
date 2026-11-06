import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { imageFormat, normalizeImage, pool } from './images';

const png = (width: number, height: number) =>
  sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 160, g: 70, b: 50, alpha: 0.5 },
    },
  })
    .png()
    .toBuffer();

describe('images du PDF', () => {
  it('reconnaît les formats à leurs premiers octets', async () => {
    expect(imageFormat(await png(2, 2))).toBe('png');
    expect(
      imageFormat(
        await sharp(await png(2, 2))
          .jpeg()
          .toBuffer(),
      ),
    ).toBe('jpeg');
    expect(
      imageFormat(
        await sharp(await png(2, 2))
          .webp()
          .toBuffer(),
      ),
    ).toBe('webp');
    expect(
      imageFormat(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>')),
    ).toBeNull();
    expect(imageFormat(Buffer.from('GIF89a'))).toBe('gif');
    expect(imageFormat(Buffer.alloc(0))).toBeNull();
  });

  it('réduit une grande image en JPEG sur le papier', async () => {
    const image = await normalizeImage(await png(1200, 600), 300);
    expect(image).toMatchObject({ format: 'jpg', width: 300, height: 150 });
    expect(imageFormat(image!.data)).toBe('jpeg');
  });

  it('n’agrandit pas une petite image', async () => {
    const image = await normalizeImage(await png(40, 20), 300);
    expect(image).toMatchObject({ width: 40, height: 20 });
  });

  it('refuse un SVG et un fichier abîmé', async () => {
    expect(
      await normalizeImage(
        Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'),
        300,
      ),
    ).toBeNull();
    const broken = Buffer.concat([(await png(10, 10)).subarray(0, 30)]);
    expect(await normalizeImage(broken, 300)).toBeNull();
  });

  it('limite les lectures en parallèle et garde l’ordre', async () => {
    let running = 0;
    let peak = 0;
    const results = await pool([5, 1, 4, 2, 3], 2, async (n) => {
      running++;
      peak = Math.max(peak, running);
      await new Promise((r) => setTimeout(r, n));
      running--;
      return n * 10;
    });
    expect(results).toEqual([50, 10, 40, 20, 30]);
    expect(peak).toBe(2);
    expect(await pool([], 3, async () => 1)).toEqual([]);
  });
});
