import { openDB } from 'idb';
import type { Block } from '../types/blockchain';
import type { Voter } from '../types/voter';

const DB_NAME = 'voting-system';
const DB_VERSION = 1;

export async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('blockchain')) {
        db.createObjectStore('blockchain', { keyPath: 'index' });
      }
      if (!db.objectStoreNames.contains('voters')) {
        db.createObjectStore('voters', { keyPath: 'id' });
      }
    },
  });
  return db;
}

export async function saveBlockchain(blocks: Block[]) {
  const db = await initDB();
  const tx = db.transaction('blockchain', 'readwrite');
  const store = tx.objectStore('blockchain');
  await Promise.all(blocks.map(block => store.put(block)));
  await tx.done;
}

export async function loadBlockchain(): Promise<Block[]> {
  const db = await initDB();
  return db.getAll('blockchain');
}

export async function saveVoter(voter: Voter) {
  const db = await initDB();
  await db.put('voters', voter);
}

export async function getVoter(id: string): Promise<Voter | undefined> {
  const db = await initDB();
  return db.get('voters', id);
}

export async function updateVoterStatus(id: string, hasVoted: boolean) {
  const db = await initDB();
  const voter = await db.get('voters', id);
  if (voter) {
    voter.hasVoted = hasVoted;
    await db.put('voters', voter);
  }
}