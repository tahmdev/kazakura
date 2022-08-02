import { db } from "../firebase";

interface Icache {
  [guildId: string]: {
    [name: string]: { content: string; id: string };
  };
}

class TagCache {
  #cache: Icache;

  constructor() {
    this.#cache = {} as Icache;
  }
  get cache() {
    return this.#cache;
  }
  async buildCache() {
    const newCache = {} as Icache;
    (await db.collectionGroup("tags").get()).forEach((doc) => {
      const guild = doc.ref.parent.parent?.id;
      if (!guild) return;
      const { name, text } = doc.data();
      if (!newCache[guild]) newCache[guild] = {};
      newCache[guild][name] = { content: text, id: doc.ref.id };
    });
    this.#cache = newCache;
  }
}

export const tagCache = new TagCache();
