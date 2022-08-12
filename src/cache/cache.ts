import { db } from "../firebase";

interface TagCache {
  [guildId: string]: {
    [name: string]: { content: string; id: string };
  };
}

interface Permissions {
  [guildId: string]: {
    [name: string]: string[];
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
  #permissions: Permissions;
  constructor() {
    this.#tags = {} as TagCache;
    this.reminders = [];
    this.#permissions = {} as Permissions;
  }

  guild(id: string) {
    return {
      tags: this.#tags[id] || {},
      permissions: this.#permissions[id] || {},
    };
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

    db.collectionGroup("permissions").onSnapshot((snapshot) => {
      const newPermissions = {} as Permissions;
      snapshot.forEach((doc) => {
        const guildId = doc.ref.parent.parent?.id;
        const { roleIds } = doc.data();
        const cmd = doc.ref.id;
        if (!guildId) return;
        if (!newPermissions[guildId]) newPermissions[guildId] = {};
        newPermissions[guildId][cmd] = roleIds || [];
      });
      this.#permissions = newPermissions;
      console.log(this.#permissions);
    });
  }
}

export const cache = new Cache();
