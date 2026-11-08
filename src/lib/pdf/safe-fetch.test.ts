import { describe, expect, it } from 'vitest';
import { isBlockedAddress, parseSafeUrl, safeGet } from './safe-fetch';

describe('adresses refusées', () => {
  it.each([
    '127.0.0.1',
    '127.1.2.3',
    '10.0.0.5',
    '172.16.4.2',
    '192.168.1.27',
    '169.254.169.254',
    '100.64.0.1',
    '0.0.0.0',
    '224.0.0.1',
    '::1',
    '::',
    'fe80::1',
    'fd00::1',
    '::ffff:127.0.0.1',
    '::ffff:7f00:1',
    'pas-une-ip',
  ])('refuse %s', (address) => {
    expect(isBlockedAddress(address)).toBe(true);
  });

  it.each(['8.8.8.8', '151.101.1.69', '2606:4700::6810:84e5'])(
    'accepte %s',
    (address) => {
      expect(isBlockedAddress(address)).toBe(false);
    },
  );
});

describe('adresses lisibles', () => {
  it('accepte http et https seulement', () => {
    expect(parseSafeUrl('https://exemple.org/a.png')).not.toBeNull();
    expect(parseSafeUrl('http://exemple.org/a.png')).not.toBeNull();
    expect(parseSafeUrl('file:///etc/passwd')).toBeNull();
    expect(parseSafeUrl('data:image/png;base64,AAAA')).toBeNull();
    expect(parseSafeUrl('ftp://exemple.org/a.png')).toBeNull();
    expect(parseSafeUrl('pas une adresse')).toBeNull();
  });

  it('refuse les identifiants dans l’adresse', () => {
    expect(parseSafeUrl('https://moi:secret@exemple.org/a.png')).toBeNull();
  });

  it('refuse une IP interne écrite telle quelle', () => {
    expect(parseSafeUrl('http://127.0.0.1:9001/')).toBeNull();
    expect(parseSafeUrl('http://[::1]/')).toBeNull();
    expect(parseSafeUrl('http://169.254.169.254/latest/meta-data')).toBeNull();
  });

  it('ne lit pas une adresse qui se résout en interne', async () => {
    expect(
      await safeGet('http://localhost:1/', { timeoutMs: 2000 }),
    ).toBeNull();
    expect(await safeGet('http://127.0.0.1/', { timeoutMs: 2000 })).toBeNull();
  });
});
