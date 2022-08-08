import { db } from "../firebase";

interface TagCache {
  [guildId: string]: {
    [name: string]: { content: string; id: string };
  };
}

class Cache {
  #tags: TagCache;

  constructor() {
    this.#tags = {} as TagCache;
  }

  guild(id: string) {
    return { tags: this.#tags[id] || {} };
  }
  buildCache() {
    db.collectionGroup("tags").onSnapshot((snapshot) => {
      const newTags = {} as TagCache;
      snapshot.forEach((doc) => {
        const guildId = doc.ref.parent.parent?.id;
        const { name, content } = doc.data();
        if (!guildId) return;
        if (!newTags[guildId]) newTags[guildId] = {};
        newTags[guildId][name] = { content: content, id: doc.ref.id };
      });
      this.#tags = newTags;
    });
  }
}

export const cache = new Cache();
