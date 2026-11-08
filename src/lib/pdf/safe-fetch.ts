import dns from 'node:dns';
import http from 'node:http';
import https from 'node:https';
import { BlockList, isIP, type LookupFunction } from 'node:net';

/**
 * Lecture d'une image distante pour le PDF. Les adresses viennent des
 * joueur·euses (portrait, images des notes) : le serveur ne doit jamais
 * aller lire, à leur place, une adresse interne (la machine elle-même, le
 * réseau privé, les métadonnées du nuage). L'adresse IP est vérifiée au
 * moment de la connexion, après résolution DNS, et à chaque redirection.
 */

const BLOCKED = new BlockList();
for (const [net, prefix] of [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.0.2.0', 24],
  ['192.88.99.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['198.51.100.0', 24],
  ['203.0.113.0', 24],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
] as const) {
  BLOCKED.addSubnet(net, prefix, 'ipv4');
}
for (const [net, prefix] of [
  ['::', 128],
  ['::1', 128],
  ['64:ff9b::', 96],
  ['100::', 64],
  ['2001:db8::', 32],
  ['fc00::', 7],
  ['fe80::', 10],
  ['ff00::', 8],
] as const) {
  BLOCKED.addSubnet(net, prefix, 'ipv6');
}

/** Vrai pour une adresse interne, réservée, ou qui n'est pas une IP. */
export const isBlockedAddress = (address: string) => {
  const family = isIP(address);
  if (!family) return true;
  // Une IPv4 écrite en IPv6 (::ffff:127.0.0.1) suit les règles IPv4.
  return BLOCKED.check(address, family === 4 ? 'ipv4' : 'ipv6');
};

class BlockedAddressError extends Error {}

/** Résolution DNS qui refuse toute adresse interne. */
const safeLookup: LookupFunction = (hostname, options, callback) => {
  dns.lookup(hostname, { ...options, all: true }, (error, addresses) => {
    if (error) return callback(error, '', 4);
    const list = addresses as dns.LookupAddress[];
    if (!list.length || list.some((a) => isBlockedAddress(a.address))) {
      return callback(new BlockedAddressError(hostname), '', 4);
    }
    if (options.all) return callback(null, list);
    callback(null, list[0].address, list[0].family);
  });
};

export interface SafeGetOptions {
  /** Pour toute la lecture, redirections comprises. */
  timeoutMs?: number;
  maxBytes?: number;
  maxRedirects?: number;
}

export interface SafeGetResult {
  body: Buffer;
  contentType: string;
}

/** Une adresse qu'on accepte de lire : http(s), sans identifiants. */
export const parseSafeUrl = (raw: string) => {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (url.username || url.password) return null;
  const host = url.hostname.replace(/^\[|\]$/g, '');
  // Une IP écrite telle quelle ne passe pas par la résolution DNS.
  if (isIP(host) && isBlockedAddress(host)) return null;
  return url;
};

const request = (url: URL, signal: AbortSignal, maxBytes: number) =>
  new Promise<
    | { kind: 'redirect'; location: string }
    | { kind: 'body'; result: SafeGetResult }
    | null
  >((resolve) => {
    const client = url.protocol === 'https:' ? https : http;
    const req = client.get(
      url,
      {
        signal,
        lookup: safeLookup,
        headers: {
          Accept: 'image/*',
          'User-Agent': 'Oniria-PDF/1.0',
        },
      },
      (res) => {
        const status = res.statusCode ?? 0;
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          return resolve({ kind: 'redirect', location: res.headers.location });
        }
        const contentType = String(res.headers['content-type'] ?? '');
        const length = Number(res.headers['content-length'] ?? 0);
        if (status < 200 || status >= 300 || length > maxBytes) {
          res.resume();
          return resolve(null);
        }
        const chunks: Buffer[] = [];
        let size = 0;
        res.on('data', (chunk: Buffer) => {
          if (size > maxBytes) return;
          size += chunk.length;
          if (size > maxBytes) {
            req.destroy();
            resolve(null);
            return;
          }
          chunks.push(chunk);
        });
        res.on('end', () =>
          resolve({
            kind: 'body',
            result: { body: Buffer.concat(chunks), contentType },
          }),
        );
        res.on('error', () => resolve(null));
      },
    );
    req.on('error', () => resolve(null));
  });

/**
 * Lit une adresse distante, ou rend `null` : adresse refusée, interne,
 * trop lente, trop lourde, en erreur. Ne lève jamais.
 */
export const safeGet = async (
  raw: string,
  {
    timeoutMs = 3000,
    maxBytes = 5 * 1024 * 1024,
    maxRedirects = 3,
  }: SafeGetOptions = {},
): Promise<SafeGetResult | null> => {
  const signal = AbortSignal.timeout(timeoutMs);
  let url = parseSafeUrl(raw);
  for (let hop = 0; url && hop <= maxRedirects; hop++) {
    const answer = await request(url, signal, maxBytes);
    if (!answer) return null;
    if (answer.kind === 'body') return answer.result;
    // Une redirection est vérifiée comme l'adresse de départ.
    let next: string;
    try {
      next = new URL(answer.location, url).toString();
    } catch {
      return null;
    }
    url = parseSafeUrl(next);
  }
  return null;
};
