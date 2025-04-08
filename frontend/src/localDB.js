import Dexie from 'dexie';

export const db = new Dexie('MyAppDB');

db.version(1).stores({
  pendingOperations: '++id, type, payload',
});