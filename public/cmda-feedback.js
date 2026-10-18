/* CMDA complaints and feedback widget. No cookies, credentials or parent-page content are read. */
(() => {
  if (document.getElementById("cmda-feedback-widget")) return;
  const script = document.currentScript;
  const origin = new URL(script.src).origin;
  const site = location.hostname.replace(/^www\./, "");
  if (!["cmdanigeria.org", "cmdanigeria.net", "localhost", "127.0.0.1"].includes(site)) return;
  const mount = document.createElement("div");
  mount.id = "cmda-feedback-widget";
  const root = mount.attachShadow({ mode: "closed" });
  const style = document.createElement("style");
  style.textContent =
    ":host{position:fixed;right:16px;bottom:24px;z-index:2147483000;font:14px system-ui}button{font:inherit;cursor:pointer;border:0;border-radius:24px;background:#994279;color:white;padding:13px 18px;box-shadow:0 4px 20px #0002}dialog{border:1px solid #e3dce1;border-radius:16px;padding:0;width:min(460px,calc(100vw - 24px));height:min(740px,calc(100dvh - 32px));overflow:hidden}dialog::backdrop{background:#0006}.bar{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #eee;gap:12px}.bar a{color:#994279;font-size:12px}.bar button{padding:8px 12px;box-shadow:none}iframe{width:100%;height:calc(100% - 60px);border:0}";
  const trigger = document.createElement("button");
  trigger.textContent = "Help & feedback";
  trigger.type = "button";
  trigger.setAttribute("aria-haspopup", "dialog");
  const dialog = document.createElement("dialog");
  dialog.setAttribute("aria-label", "CMDA complaints and feedback");
  const bar = document.createElement("div");
  bar.className = "bar";
  const fallback = document.createElement("a");
  fallback.textContent = "Open in a new tab";
  fallback.href = `${origin}/support?site=${encodeURIComponent(site)}`;
  fallback.target = "_blank";
  fallback.rel = "noopener noreferrer";
  const close = document.createElement("button");
  close.textContent = "Close";
  close.type = "button";
  const frame = document.createElement("iframe");
  frame.title = "CMDA complaints and feedback";
  frame.referrerPolicy = "no-referrer";
  frame.setAttribute("sandbox", "allow-scripts allow-forms allow-same-origin");
  close.onclick = () => dialog.close();
  trigger.onclick = () => {
    if (!frame.src) frame.src = `${origin}/support/embed?site=${encodeURIComponent(site)}`;
    dialog.showModal();
  };
  dialog.addEventListener("close", () => trigger.focus());
  bar.append(fallback, close);
  dialog.append(bar, frame);
  root.append(style, trigger, dialog);
  document.body.append(mount);
})();
