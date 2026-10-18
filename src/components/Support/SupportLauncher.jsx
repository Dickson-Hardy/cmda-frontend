import { lazy, Suspense, useEffect, useRef, useState } from "react";
const SupportPortal = lazy(() => import("./SupportPortal"));

export default function SupportLauncher() {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const trigger = useRef(null);
  const dialog = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const triggerButton = trigger.current;
    document.body.style.overflow = "hidden";
    dialog.current?.querySelector("button")?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab") {
        const controls = dialog.current?.querySelectorAll(
          'button:not([disabled]), input:not([type="hidden"]):not([tabindex="-1"]), textarea, select, a[href]'
        );
        if (!controls?.length) return;
        const first = controls[0],
          last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      triggerButton?.focus();
    };
  }, [open]);
  if (window.location.pathname.startsWith("/support")) return null;
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="fixed right-4 bottom-24 md:bottom-6 z-40 rounded-full bg-primary text-white px-4 py-3 shadow-lg text-sm font-semibold"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setOpened(true);
          setOpen(true);
        }}
      >
        Help & feedback
      </button>
      {opened ? (
        <div
          style={{ display: open ? "flex" : "none" }}
          className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-3"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label="Complaints and feedback"
            className="bg-white rounded-2xl w-full max-w-xl max-h-[90dvh] overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-white flex justify-end px-4 pt-3 z-10">
              <button type="button" className="px-3 py-2 rounded-lg border text-sm" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <Suspense
              fallback={
                <p role="status" className="p-6">
                  Loading support form…
                </p>
              }
            >
              <SupportPortal embedded />
            </Suspense>
          </div>
        </div>
      ) : null}
    </>
  );
}
