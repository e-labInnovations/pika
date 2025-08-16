/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

self.skipWaiting();
clientsClaim();

// Precache files
precacheAndRoute(self.__WB_MANIFEST);

// Define the shared data interface
interface SharedData {
  title?: string;
  text?: string;
  sharedUrl?: string;
  files?: SerializedFile[];
}

// Define serialized file interface for cross-browser compatibility
interface SerializedFile {
  name: string;
  type: string;
  size: number;
  data: ArrayBuffer;
}

// IndexedDB wrapper for persistent storage
class SharedDataDB {
  private dbName = 'PikaSharedData';
  private version = 1;
  private storeName = 'shares';

  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveShare(id: string, data: SharedData): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);

    // Add timestamp for cleanup
    const shareData = {
      id,
      ...data,
      timestamp: Date.now(),
    };

    await new Promise<void>((resolve, reject) => {
      const request = store.put(shareData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Clean up old entries (older than 1 hour)
    await this.cleanupOldEntries();
  }

  async getShare(id: string): Promise<SharedData | null> {
    const db = await this.openDB();
    const tx = db.transaction(this.storeName, 'readonly');
    const store = tx.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteShare(id: string): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async cleanupOldEntries(): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    const index = store.index('timestamp');

    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    const request = index.openCursor(IDBKeyRange.upperBound(oneHourAgo));
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        store.delete(cursor.primaryKey);
        cursor.continue();
      }
    };
  }
}

// Initialize the database
const sharedDataDB = new SharedDataDB();

// Debug flag - set to false in production
const DEBUG_WEB_SHARE = false;

const log = (message: string, ...args: unknown[]) => {
  if (DEBUG_WEB_SHARE) {
    console.log(message, ...args);
  }
};

// Log service worker initialization (only in debug mode)
log('Pika Service Worker: Initialized with IndexedDB support');

// Catch share POST requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.method === 'POST' && url.pathname === '/pika/share') {
    log('Pika Service Worker: Intercepted POST request to /pika/share');

    event.respondWith(
      (async () => {
        try {
          const formData = await event.request.formData();
          const title = formData.get('title') as string;
          const text = formData.get('text') as string;
          const sharedUrl = formData.get('url') as string;
          const files = formData.getAll('images') as File[];

          log('Pika Service Worker: Extracted form data:', {
            title,
            text,
            sharedUrl,
            filesCount: files.length,
          });

          // Serialize files for cross-browser compatibility
          const serializedFiles = await Promise.all(
            files.map(async (file) => ({
              name: file.name,
              type: file.type,
              size: file.size,
              data: await file.arrayBuffer(),
            })),
          );

          const id = crypto.randomUUID();
          log('Pika Service Worker: Generated share ID:', id);

          await sharedDataDB.saveShare(id, { title, text, sharedUrl, files: serializedFiles });
          log('Pika Service Worker: Saved share data to IndexedDB');

          // Redirect to the add page with the share ID
          const redirectUrl = `/pika/add?shareId=${id}`;
          log('Pika Service Worker: Redirecting to:', redirectUrl);
          return Response.redirect(redirectUrl, 303);
        } catch (error) {
          log('Pika Service Worker: Error processing share request:', error);
          // Fallback: redirect to add page without data
          return Response.redirect('/pika/add', 303);
        }
      })(),
    );
  }
});

// Handle messages from clients to retrieve shared data
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_SHARED_DATA') {
    const { shareId } = event.data;
    log('Pika Service Worker: Received GET_SHARED_DATA request for share ID:', shareId);

    // Use async/await pattern for IndexedDB operations
    (async () => {
      try {
        const sharedData = await sharedDataDB.getShare(shareId);
        log('Pika Service Worker: Retrieved shared data:', sharedData ? 'found' : 'not found');

        if (sharedData && event.ports[0]) {
          // Send the shared data back to the client
          event.ports[0].postMessage({
            type: 'SHARED_DATA_RESPONSE',
            payload: sharedData,
          });
          log('Pika Service Worker: Sent shared data to client');

          // Clean up the data after sending
          await sharedDataDB.deleteShare(shareId);
          log('Pika Service Worker: Cleaned up shared data');
        } else if (event.ports[0]) {
          event.ports[0].postMessage({
            type: 'SHARED_DATA_RESPONSE',
            payload: null,
          });
          log('Pika Service Worker: No shared data found, sent null response');
        }
      } catch (error) {
        log('Pika Service Worker: Error retrieving shared data:', error);
        if (event.ports[0]) {
          event.ports[0].postMessage({
            type: 'SHARED_DATA_RESPONSE',
            payload: null,
          });
        }
      }
    })();
  }
});
