import { db } from "../firebase";

interface TagCache {
  [guildId: string]: {
    [name: string]: { content: string; id: string };
  };
}

interface Reminder {
  message: string;
  time: number;
  author: string;
  createdAt: number;
  id: string;
}

class Cache {
  #tags: TagCache;
  reminders: Reminder[];
  constructor() {
    this.#tags = {} as TagCache;
    this.reminders = [];
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

    db.collectionGroup("reminders").onSnapshot((snapshot) => {
      const newReminders: Reminder[] = [];
      snapshot.forEach((doc) => {
        const author = doc.ref.parent.parent?.id;
        const { time, message, createdAt } = doc.data();
        if (!author || !time) return;
        newReminders.push({ author, time, message, createdAt, id: doc.ref.id });
      });
      this.reminders = newReminders.sort((a, b) => a.time - b.time);
    });
  }
}

export const cache = new Cache();
