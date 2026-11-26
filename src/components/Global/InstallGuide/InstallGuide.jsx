import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Modal from "~/components/Global/Modal/Modal";
import Button from "~/components/Global/Button/Button";
import { classNames } from "~/utilities/classNames";

const PROMPT_KEY = "cmda_install_guide_prompted";
const OPEN_EVENT = "cmda:open-install-guide";

/** Open the install guide from anywhere (e.g. the Settings button). */
export const openInstallGuide = () => window.dispatchEvent(new CustomEvent(OPEN_EVENT));

export const isStandaloneApp = () =>
  Boolean(window.matchMedia?.("(display-mode: standalone)").matches) || Boolean(window.navigator.standalone);

const isMobileDevice = () =>
  Boolean(window.matchMedia?.("(pointer: coarse)").matches) ||
  /Mobi|Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent || "");

const detectPlatform = () => {
  const ua = window.navigator.userAgent || "";
  if (/Android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  return "desktop";
};

const PLATFORMS = [
  { id: "ios", label: "iOS" },
  { id: "android", label: "Android" },
  { id: "desktop", label: "Desktop" },
];

const STEPS = {
  ios: [
    "Open cmdanigeria.net in Safari",
    "Tap the Share button",
    "Select \u201cAdd to Home Screen\u201d",
    "Tap \u201cAdd\u201d",
  ],
  android: [
    "Open cmdanigeria.net in your browser and tap \u22ee",
    "Tap \u201cAdd to home screen\u201d",
    "Tap \u201cInstall\u201d",
  ],
  desktop: [
    "Open cmdanigeria.net in Chrome or Edge",
    "Click the install icon in the address bar",
    "Click \u201cInstall\u201d",
  ],
};

/** Pulsing dot that marks the element the user should tap. */
const Tap = ({ className }) => (
  <span
    aria-hidden="true"
    className={classNames(
      "pointer-events-none absolute -right-1.5 -top-1.5 h-3.5 w-3.5 animate-ping rounded-full bg-primary/50",
      className,
    )}
  />
);

const PhoneFrame = ({ children }) => (
  <div className="relative w-40 shrink-0 rounded-3xl border-2 border-ink/10 bg-white p-1.5 shadow-md sm:w-44">
    <div className="mx-auto mb-1 h-1.5 w-14 rounded-full bg-surface" />
    <div className="h-40 overflow-hidden rounded-2xl bg-white text-[10px] text-ink sm:h-44" aria-hidden="true">
      {children}
    </div>
  </div>
);

const ContentBars = () => (
  <div className="space-y-1.5 px-3 pt-3">
    <div className="h-2 w-2/3 rounded bg-surface" />
    <div className="h-2 w-full rounded bg-surface" />
    <div className="h-2 w-5/6 rounded bg-surface" />
    <div className="h-2 w-3/4 rounded bg-surface" />
  </div>
);

const ShareIcon = () => (
  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M8 10V3M5.5 5.5 8 3l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 8.5v3.5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8.5" strokeLinecap="round" />
  </svg>
);

const InstallBubble = ({ label }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-2.5 shadow-lg">
    <div className="mx-auto h-9 w-9 rounded-lg bg-primary" />
    <p className="mt-1.5 text-center text-[10px] font-semibold">{"Install \u201cCMDA\u201d?"}</p>
    <p className="text-center text-[8px] text-muted">cmdanigeria.net</p>
    <div className="mt-2 flex justify-end gap-3 text-[9px] font-semibold">
      <span className="text-muted">Cancel</span>
      <span className="relative text-primary">
        {label}
        <Tap />
      </span>
    </div>
  </div>
);

const IosVisual = ({ step }) => {
  if (step === 3) {
    return (
      <PhoneFrame>
        <div className="flex h-full items-center justify-center bg-black/5 p-3">
          <div className="w-full">
            <div className="rounded-xl bg-white p-2.5 shadow-lg">
              <div className="mx-auto h-9 w-9 rounded-lg bg-primary" />
              <p className="mt-1.5 text-center text-[10px] font-semibold">Add to Home Screen</p>
              <p className="truncate text-center text-[8px] text-muted">cmdanigeria.net</p>
              <div className="mt-2 flex justify-end gap-2 text-[9px] font-semibold">
                <span className="rounded border border-gray-200 px-2 py-1 text-muted">Cancel</span>
                <span className="relative rounded bg-primary px-2 py-1 text-white">
                  Add
                  <Tap />
                </span>
              </div>
            </div>
          </div>
        </div>
      </PhoneFrame>
    );
  }
  if (step === 2) {
    return (
      <PhoneFrame>
        <div className="flex h-full flex-col justify-end bg-black/5 p-2">
          <div className="rounded-xl bg-white p-1.5 shadow-lg">
            <ul className="space-y-0.5 text-[9px]">
              {["Copy", "Add Bookmark", "Add to Home Screen", "Find on Page"].map((item) => (
                <li
                  key={item}
                  className={classNames(
                    "relative rounded px-2 py-1.5",
                    item === "Add to Home Screen" ? "bg-primaryTint font-semibold text-primary" : "text-gray-600",
                  )}
                >
                  {item}
                  {item === "Add to Home Screen" ? <Tap /> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PhoneFrame>
    );
  }
  return (
    <PhoneFrame>
      <div className="flex h-full flex-col">
        <div className="px-2 pt-2">
          <div
            className={classNames(
              "relative rounded-full border px-2 py-1 text-center",
              step === 0 ? "border-primary text-ink" : "border-gray-200 text-muted",
            )}
          >
            cmdanigeria.net
            {step === 0 ? <Tap className="right-2 top-1/2 -translate-y-1/2" /> : null}
          </div>
        </div>
        <div className="flex-1">
          <ContentBars />
        </div>
        <div className="flex items-center justify-around border-t border-gray-100 bg-white px-3 py-2 text-gray-400">
          <span className="text-sm">{"\u2039"}</span>
          <span className="text-sm">{"\u203a"}</span>
          <span
            className={classNames(
              "relative rounded p-1",
              step === 1 ? "bg-primaryTint text-primary" : "text-gray-400",
            )}
          >
            <ShareIcon />
            {step === 1 ? <Tap /> : null}
          </span>
          <span className="text-sm">{"\u25a6"}</span>
          <span className="text-sm">{"\u2395"}</span>
        </div>
      </div>
    </PhoneFrame>
  );
};

const AndroidVisual = ({ step }) => {
  if (step === 2) {
    return (
      <PhoneFrame>
        <div className="flex h-full items-center justify-center p-3">
          <InstallBubble label="Install" />
        </div>
      </PhoneFrame>
    );
  }
  return (
    <PhoneFrame>
      <div className="relative flex h-full flex-col">
        <div className="flex items-center gap-1 px-2 py-2">
          <span className="flex-1 truncate rounded-full bg-surface px-2 py-1 text-center text-[9px] text-muted">
            cmdanigeria.net
          </span>
          <span
            className={classNames(
              "relative rounded p-0.5 text-base leading-none",
              step === 0 ? "bg-primaryTint text-primary" : "text-gray-500",
            )}
          >
            {"\u22ee"}
            {step === 0 ? <Tap /> : null}
          </span>
        </div>
        <div className="flex-1">
          <ContentBars />
        </div>
        {step === 1 ? (
          <div className="absolute right-2 top-10 w-32 rounded-lg border border-gray-100 bg-white py-1 text-[9px] shadow-lg">
            {["New tab", "History", "Bookmarks", "Add to home screen", "Settings"].map((item) => (
              <div
                key={item}
                className={classNames(
                  "relative px-3 py-1.5",
                  item === "Add to home screen" ? "bg-primaryTint font-semibold text-primary" : "text-gray-600",
                )}
              >
                {item}
                {item === "Add to home screen" ? <Tap /> : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </PhoneFrame>
  );
};

const DesktopVisual = ({ step }) => (
  <div
    className="mx-auto w-full max-w-[15rem] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md"
    aria-hidden="true"
  >
    <div className="flex items-center gap-1.5 border-b border-gray-100 bg-surface px-2 py-1.5">
      <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
      <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
      <span className="h-2 w-2 rounded-full bg-[#28c840]" />
    </div>
    <div className="flex items-center gap-1 px-2 py-2">
      <span
        className={classNames(
          "min-w-0 flex-1 truncate rounded-full border px-2 py-1 text-center text-[9px]",
          step === 0 ? "border-primary text-ink" : "border-gray-200 text-muted",
        )}
      >
        cmdanigeria.net
        {step === 0 ? <Tap className="right-1 top-1/2 -translate-y-1/2" /> : null}
      </span>
      <span
        className={classNames(
          "relative rounded p-1 text-xs leading-none",
          step === 1 ? "bg-primaryTint text-primary" : "text-gray-400",
        )}
      >
        {"\u2913"}
        {step === 1 ? <Tap /> : null}
      </span>
      <span className="text-xs text-gray-400">{"\u22ee"}</span>
    </div>
    <div className="space-y-1.5 px-3 pb-3">
      <div className="h-2 w-2/3 rounded bg-surface" />
      <div className="h-2 w-full rounded bg-surface" />
      <div className="h-2 w-5/6 rounded bg-surface" />
    </div>
    {step === 2 ? (
      <div className="border-t border-gray-100 p-2">
        <InstallBubble label="Install" />
      </div>
    ) : null}
  </div>
);

const StepVisual = ({ platform, step }) => {
  if (platform === "ios") return <IosVisual step={step} />;
  if (platform === "android") return <AndroidVisual step={step} />;
  return <DesktopVisual step={step} />;
};

/**
 * Stake-style install guide: platform tabs, an auto-playing step animation
 * with a numbered badge, and the matching text steps.
 */
const InstallGuide = () => {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState(detectPlatform);
  const [step, setStep] = useState(0);
  const steps = STEPS[platform];

  // Opened from anywhere via the shared event (Settings button).
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  // Deep link: /?modal=install
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("modal") === "install") setOpen(true);
  }, []);

  // One-time auto prompt for logged-in mobile users who have not installed
  // the app. Waits for any other dialog (tutorial, profile prompt) to close.
  useEffect(() => {
    if (!isAuthenticated) return undefined;
    if (isStandaloneApp() || !isMobileDevice()) return undefined;
    if (window.localStorage.getItem(PROMPT_KEY)) return undefined;
    let attempts = 0;
    let timer;
    const tryShow = () => {
      if (document.querySelector('dialog[open], [role="dialog"]')) {
        attempts += 1;
        if (attempts < 5) timer = setTimeout(tryShow, 12000);
        return;
      }
      window.localStorage.setItem(PROMPT_KEY, "1");
      setPlatform(detectPlatform());
      setStep(0);
      setOpen(true);
    };
    timer = setTimeout(tryShow, 12000);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  // Auto-advance the step animation while the guide is open.
  useEffect(() => {
    if (!open) return undefined;
    const timer = setInterval(() => setStep((current) => (current + 1) % steps.length), 2800);
    return () => clearInterval(timer);
  }, [open, steps.length]);

  const selectPlatform = (id) => {
    setPlatform(id);
    setStep(0);
  };

  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Install CMDA"
      subtitle="Add the app to your home screen for one-tap access, just like a native app."
      maxWidth={440}
    >
      <div className="mb-4 flex gap-2" role="tablist" aria-label="Choose your platform">
        {PLATFORMS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={platform === item.id}
            onClick={() => selectPlatform(item.id)}
            className={classNames(
              "flex-1 rounded-full px-3 py-2 text-sm font-semibold transition",
              platform === item.id ? "bg-primary text-white" : "bg-surface text-muted hover:bg-primaryTint",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 rounded-xl bg-primaryTint2 p-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/10 bg-white text-lg font-bold text-primary shadow-md"
          aria-hidden="true"
        >
          {step + 1}
        </span>
        <div aria-hidden="true">
          <StepVisual platform={platform} step={step} />
        </div>
      </div>

      <ol className="mb-4 mt-4 list-inside list-decimal space-y-2 text-sm">
        {steps.map((text, index) => (
          <li key={text}>
            <button
              type="button"
              onClick={() => setStep(index)}
              className={classNames(
                "text-left",
                index === step ? "font-semibold text-primary" : "text-gray-600 hover:text-ink",
              )}
            >
              {text}
            </button>
          </li>
        ))}
      </ol>

      <Button type="button" label="Close" className="w-full" onClick={() => setOpen(false)} />
    </Modal>
  );
};

export default InstallGuide;
