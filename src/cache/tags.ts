import { db } from "../firebase";
import { collectionGroup, getDocs, query } from "firebase/firestore";

interface Icache {
  [guildId: string]: {
    [name: string]: string;
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
    const tags = query(collectionGroup(db, "tags"));
    const snap = await getDocs(tags);
    snap.forEach((doc) => {
      const guild = doc.ref.parent.parent?.id;
      if (!guild) return;
      const { name, text } = doc.data();
      if (!newCache[guild]) newCache[guild] = {};
      newCache[guild][name] = text;
    });
    this.#cache = newCache;
  }
}

export const tagCache = new TagCache();
