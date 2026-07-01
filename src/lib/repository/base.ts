// Repository temel katmanı.
// Sunucuda (SSR/prerender) başlangıç seed verisini, tarayıcıda localStorage'ı
// kullanır. Tüm fonksiyonlar Promise döner; böylece ileride backend'e geçişte
// çağıran kodun imzası değişmez.

const STORAGE_PREFIX = "halisaha:";

export interface BaseEntity {
  id: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function storageKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

/** Benzersiz id üretir (ör. "t_ab12..."). */
export function generateId(prefix: string): string {
  if (isBrowser() && typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.round(
    Math.random() * 1_000_000,
  ).toString(36)}`;
}

/** localStorage'tan koleksiyon okur; yoksa seed ile tohumlar. Sunucuda seed döner. */
function readCollection<T>(key: string, seed: T[]): T[] {
  if (!isBrowser()) return seed;
  try {
    const raw = window.localStorage.getItem(storageKey(key));
    if (raw === null) {
      window.localStorage.setItem(storageKey(key), JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T[];
  } catch {
    return seed;
  }
}

function writeCollection<T>(key: string, data: T[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(storageKey(key), JSON.stringify(data));
}

/** Tekil bir kaydı (ör. site ayarları) okur. */
export function readSingle<T>(key: string, seed: T): T {
  if (!isBrowser()) return seed;
  try {
    const raw = window.localStorage.getItem(storageKey(key));
    if (raw === null) {
      window.localStorage.setItem(storageKey(key), JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
}

export function writeSingle<T>(key: string, data: T): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(storageKey(key), JSON.stringify(data));
}

export interface CollectionRepository<T extends BaseEntity> {
  getAll: () => Promise<T[]>;
  getById: (id: string) => Promise<T | null>;
  create: (input: Omit<T, "id">) => Promise<T>;
  update: (id: string, input: Partial<Omit<T, "id">>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

/** Bir koleksiyon için standart CRUD işlemlerini üretir. */
export function createCollection<T extends BaseEntity>(
  key: string,
  seed: T[],
  idPrefix: string,
): CollectionRepository<T> {
  async function getAll(): Promise<T[]> {
    return readCollection(key, seed);
  }

  async function getById(id: string): Promise<T | null> {
    const all = readCollection(key, seed);
    return all.find((item) => item.id === id) ?? null;
  }

  async function create(input: Omit<T, "id">): Promise<T> {
    const all = readCollection(key, seed);
    const entity = { ...input, id: generateId(idPrefix) } as T;
    writeCollection(key, [...all, entity]);
    return entity;
  }

  async function update(
    id: string,
    input: Partial<Omit<T, "id">>,
  ): Promise<T> {
    const all = readCollection(key, seed);
    const index = all.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Kayıt bulunamadı: ${id}`);
    }
    const updated = { ...all[index], ...input } as T;
    const next = [...all];
    next[index] = updated;
    writeCollection(key, next);
    return updated;
  }

  async function remove(id: string): Promise<void> {
    const all = readCollection(key, seed);
    writeCollection(
      key,
      all.filter((item) => item.id !== id),
    );
  }

  return { getAll, getById, create, update, remove };
}
