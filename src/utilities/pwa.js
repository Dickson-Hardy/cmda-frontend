import { API_BASE_URL } from "./apiBaseUrl";

const DB_NAME = "cmda-pwa";
const STORE = "outbox";
const SYNC_TAG = "cmda-outbox-sync";
const PUSH_KEY_ENDPOINT = "/notifications/push-vapid-public-key";

function openOutbox() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function registerBackgroundSync() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    if ("sync" in registration) await registration.sync.register(SYNC_TAG);
  } catch (_) {
    // Background Sync is optional; the queued item is still safe in IndexedDB.
  }
}

/** Queue a safe, retryable action to be replayed when connectivity returns. */
export async function queueAction({ url, method = "POST", body, headers }) {
  if (!("indexedDB" in window)) throw new Error("Offline queue is not supported by this browser");
  const db = await openOutbox();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).add({
      url,
      method,
      body,
      headers: headers || { "Content-Type": "application/json" },
      createdAt: Date.now(),
    });
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  await registerBackgroundSync();
}

/** Replay queued actions while the page is open (the SW also does this). */
export async function flushQueuedActions() {
  if (!("indexedDB" in window) || !navigator.onLine) return;
  const db = await openOutbox();
  const items = await new Promise((resolve, reject) => {
    const req = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });

  for (const item of items) {
    try {
      const response = await fetch(item.url, {
        method: item.method,
        headers: item.headers,
        body: item.body,
        credentials: "include",
      });
      if (!response.ok) continue;
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).delete(item.id);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    } catch (_) {
      // Keep the item for the next attempt.
    }
  }
  db.close();
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
}

export const isPushSupported = () =>
  "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

/** Fetch the VAPID public key from the API (no build-time env var required). */
export async function getPushPublicKey() {
  const response = await fetch(`${API_BASE_URL}${PUSH_KEY_ENDPOINT}`);
  if (!response.ok) throw new Error("Could not load push notification configuration");
  const body = await response.json();
  const publicKey = body?.data?.publicKey;
  if (!publicKey) throw new Error("Push notifications are not configured yet");
  return publicKey;
}

/**
 * Create (or reuse) a browser push subscription. Registration with the API is
 * handled separately by the RTK Query mutation so it carries the auth token.
 */
export async function createPushSubscription() {
  if (!isPushSupported()) throw new Error("Push notifications are not supported by this browser");

  const publicKey = await getPushPublicKey();
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Notification permission was not granted");

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }
  return subscription.toJSON();
}

/** Unsubscribe locally and return the endpoint so the API can remove it too. */
export async function removeLocalPushSubscription() {
  if (!isPushSupported()) return null;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return null;
  const endpoint = subscription.endpoint;
  await subscription.unsubscribe();
  return endpoint;
}

/** Native share sheet with a clipboard fallback. */
export async function shareContent({ title, text, url }) {
  const shareData = {
    title: title || "CMDA Nigeria",
    text: text || "",
    url: url || window.location.href,
  };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      if (error?.name === "AbortError") return false;
    }
  }
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(shareData.url);
    return true;
  }
  return false;
}
