import { API_BASE_URL } from "./apiBaseUrl";

const DB_NAME = "cmda-pwa";
const STORE = "outbox";
const SYNC_TAG = "cmda-outbox-sync";
const PUSH_ENDPOINT = "/notifications/push-subscribe";

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
        credentials: "same-origin",
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

/** Subscribe this device to Web Push. Requires VITE_VAPID_PUBLIC_KEY. */
export async function enablePushNotifications() {
  if (!isPushSupported()) throw new Error("Push notifications are not supported by this browser");
  const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!publicKey) throw new Error("Push notifications are not configured yet");

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

  const response = await fetch(`${API_BASE_URL}${PUSH_ENDPOINT}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(subscription.toJSON()),
  });
  if (!response.ok) throw new Error("Could not save your push subscription");
  return subscription;
}

export async function disablePushNotifications() {
  if (!isPushSupported()) return;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;
  await fetch(`${API_BASE_URL}${PUSH_ENDPOINT}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  }).catch(() => undefined);
  await subscription.unsubscribe();
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
