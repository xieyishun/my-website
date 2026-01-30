import { createHash } from 'node:crypto';

type SlugifyOptions = {
  overrides?: Record<string, string>;
};

const DEFAULT_OVERRIDES: Record<string, string> = {
  '\u7f51\u7edc\u90e8\u7f72': 'wang-luo-bu-shu',
  '\u5d29\u574f\uff1a\u661f\u7a79\u94c1\u9053': 'honkai-star-rail',
  '\u5d29\u574f:\u661f\u7a79\u94c1\u9053': 'honkai-star-rail',
  '\u5d29\u574f\u00b7\u661f\u7a79\u94c1\u9053': 'honkai-star-rail',
};

const normalizeKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '');

const hashOf = (value: string) =>
  createHash('sha1').update(value).digest('hex').slice(0, 8);

const toBasicSlug = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/['\u2019]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase();

export const slugify = (input: string, options: SlugifyOptions = {}) => {
  const raw = String(input ?? '').trim();
  if (!raw) return 'untitled';

  const overrides = { ...DEFAULT_OVERRIDES, ...(options.overrides ?? {}) };
  const exact = overrides[raw];
  if (exact) return exact;

  const normalizedKey = normalizeKey(raw);
  const normalized = overrides[normalizedKey];
  if (normalized) return normalized;

  const base = toBasicSlug(raw);
  const hasCjk = /[\u4E00-\u9FFF]/.test(raw);
  const needsHash = !base || hasCjk;
  const hash = hashOf(raw);

  if (!base) {
    return hasCjk ? `zh-${hash}` : `s-${hash}`;
  }

  return needsHash ? `${base}-${hash}` : base;
};

export const buildSlugMap = (names: string[]) => {
  const map = new Map<string, string>();
  for (const name of names) {
    if (map.has(name)) continue;
    map.set(name, slugify(name));
  }
  return map;
};
