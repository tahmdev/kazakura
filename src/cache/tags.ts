import { db } from "../firebase";

interface Icache {
  [guildId: string]: {
    [name: string]: { content: string; id: string };
  };
}

class TagCache {
  #cache: Icache;
  unsubscribe: () => void;

  constructor() {
    this.#cache = {} as Icache;
    this.unsubscribe = () => null;
  }

  get cache() {
    return this.#cache;
  }
  buildCache() {
    this.unsubscribe = db.collectionGroup("tags").onSnapshot((snapshot) => {
      const newCache = {} as Icache;
      snapshot.forEach((doc) => {
        const guild = doc.ref.parent.parent?.id;
        if (!guild) return;
        const { name, content } = doc.data();
        if (!newCache[guild]) newCache[guild] = {};
        newCache[guild][name] = { content: content, id: doc.ref.id };
      });
      this.#cache = newCache;
    });
  }
}

export const tagCache = new TagCache();
