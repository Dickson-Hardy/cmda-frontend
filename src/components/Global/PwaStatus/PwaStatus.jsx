import { useCallback, useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { flushQueuedActions } from "~/utilities/pwa";

/**
 * Install / update / offline UI for the PWA.
 * Updates are opt-in so a form or payment is never interrupted by a reload.
 */
const PwaStatus = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);

  const { registerSW, updateServiceWorker } = useRegisterSW({
    immediate: false,
    onNeedRefresh: () => setNeedRefresh(true),
    onOfflineReady: () => setOfflineReady(true),
  });

  useEffect(() => {
    // Register once on mount; updates stay opt-in so a form or payment is never interrupted.
    registerSW();
  }, [registerSW]);

  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      flushQueuedActions().catch(() => undefined);
    };
    const goOffline = () => setIsOnline(false);
    const captureInstall = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const installed = () => setInstallPrompt(null);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    window.addEventListener("beforeinstallprompt", captureInstall);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("beforeinstallprompt", captureInstall);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  const install = useCallback(async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }, [installPrompt]);

  if (!isOnline) {
    return (
      <div className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-[70] mx-auto max-w-sm rounded-xl bg-gray-dark px-4 py-3 text-center text-sm text-white shadow-lg md:bottom-4">
        You&apos;re offline. Public pages stay available; account and payment actions need a connection.
      </div>
    );
  }

  const showPrompt = needRefresh || offlineReady || installPrompt;
  if (!showPrompt) return null;

  return (
    <div className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-[70] mx-auto flex max-w-sm flex-col gap-2 rounded-xl border border-primary/20 bg-white p-3 shadow-xl md:bottom-4">
      {needRefresh ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-gray-dark">A new version is ready.</p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setNeedRefresh(false)}
              className="rounded-md px-3 py-1.5 text-sm font-semibold text-gray-dark hover:bg-surface"
            >
              Later
            </button>
            <button
              type="button"
              onClick={() => updateServiceWorker(true)}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primaryContainer"
            >
              Update
            </button>
          </div>
        </div>
      ) : null}
      {!needRefresh && offlineReady ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-gray-dark">CMDA is available offline.</p>
          <button
            type="button"
            onClick={() => setOfflineReady(false)}
            className="rounded-md px-2 py-1 text-sm font-semibold text-primary hover:bg-primaryTint"
          >
            Dismiss
          </button>
        </div>
      ) : null}
      {installPrompt ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-gray-dark">Install CMDA on this device.</p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setInstallPrompt(null)}
              className="rounded-md px-3 py-1.5 text-sm font-semibold text-gray-dark hover:bg-surface"
            >
              No thanks
            </button>
            <button
              type="button"
              onClick={install}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primaryContainer"
            >
              Install
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PwaStatus;
