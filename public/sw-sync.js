/* eslint-disable no-restricted-globals */
// Background sync for queued, safe actions (e.g. support feedback).
// Runs inside the service worker; keep it dependency-free.

const OUTBOX_DB = "cmda-pwa";
const OUTBOX_STORE = "outbox";
const SYNC_TAG = "cmda-outbox-sync";

function openOutbox() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(OUTBOX_DB, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(OUTBOX_STORE)) {
        db.createObjectStore(OUTBOX_STORE, { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function dbRequest(store, mode, action) {
  return openOutbox().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(OUTBOX_STORE, mode);
        const req = action(tx.objectStore(OUTBOX_STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
        tx.oncomplete = () => db.close();
      })
  );
}

function getQueued() {
  return dbRequest(OUTBOX_STORE, "readonly", (store) => store.getAll());
}

function removeQueued(id) {
  return dbRequest(OUTBOX_STORE, "readwrite", (store) => store.delete(id));
}

async function flushOutbox() {
  const queued = await getQueued();
  for (const item of queued || []) {
    try {
      const response = await fetch(item.url, {
        method: item.method || "POST",
        headers: item.headers || { "Content-Type": "application/json" },
        body: item.body,
        credentials: "same-origin",
      });
      if (response.ok) await removeQueued(item.id);
    } catch (_) {
      // Leave the item queued; the browser will retry on the next sync.
    }
  }
}

self.addEventListener("sync", (event) => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(flushOutbox());
  }
});
