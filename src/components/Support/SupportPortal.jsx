import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { API_BASE_URL } from "~/utilities/apiBaseUrl";
import { getApiErrorMessage } from "~/utilities/getApiErrorMessage";
import { queueAction } from "~/utilities/pwa";
import "./support.css";

const categories = {
  account: "Account access",
  profile: "Profile",
  payments: "Payments",
  technical: "Technical issue",
  general: "General",
};
const labels = {
  open: "Open",
  in_progress: "In progress",
  awaiting_member: "Awaiting your reply",
  resolved: "Resolved",
};
const makeIdentity = () => ({
  submissionId: crypto.randomUUID(),
  accessToken: Array.from(crypto.getRandomValues(new Uint8Array(32)), (v) => v.toString(16).padStart(2, "0")).join(""),
});

async function supportRequest(path, { token, body, method = "GET" } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(`${API_BASE_URL}/support/${path}`, {
      method,
      credentials: "omit",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        ...(token ? { "X-Support-Token": token } : {}),
        ...(body && !(body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: body instanceof FormData ? body : JSON.stringify(body) } : {}),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw { status: response.status, data };
    return data.data;
  } catch (error) {
    // Network failures while submitting a ticket are safe to retry later.
    // FormData (screenshot uploads) is not queued because replay would need a
    // fresh multipart boundary.
    if ((error?.name === "TypeError" || !navigator.onLine) && !(body instanceof FormData)) {
      await queueAction({
        url: `${API_BASE_URL}/support/${path}`,
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
          ...(token ? { "X-Support-Token": token } : {}),
          "Content-Type": "application/json",
        },
      });
      const queued = new Error("Queued while offline");
      queued.queued = true;
      throw queued;
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export default function SupportPortal({ embedded = false }) {
  const initial = useRef(new URLSearchParams(window.location.search));
  const [mode, setMode] = useState(window.location.hash.startsWith("#CMDA-") ? "track" : "new");
  const [form, setForm] = useState(() => {
    const params = initial.current;
    const sharedTitle = params.get("title") || "";
    const sharedText = params.get("text") || "";
    const sharedUrl = params.get("url") || "";
    return {
      kind: "complaint",
      category: "general",
      name: params.get("name") || "",
      email: params.get("email") || "",
      subject: sharedTitle,
      message: [sharedText, sharedUrl].filter(Boolean).join("\n"),
      website: "",
    };
  });
  const identity = useRef(null);
  const [reference, setReference] = useState(window.location.hash.slice(1).split(":")[0] || "");
  const [accessToken, setAccessToken] = useState(window.location.hash.slice(1).split(":")[1] || "");
  const [ticket, setTicket] = useState(null);
  const [file, setFile] = useState(null);
  const [reply, setReply] = useState("");
  const replyId = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [created, setCreated] = useState(false);
  const link = reference && accessToken ? `${window.location.origin}/support#${reference}:${accessToken}` : "";
  const update = (e) => setForm((previous) => ({ ...previous, [e.target.name]: e.target.value }));
  const report = (e) =>
    setError(
      getApiErrorMessage(
        e,
        "We couldn’t complete the request. Check your connection and try again. Your text has been kept."
      )
    );
  const upload = async (ref, token) => {
    if (!file) return;
    const body = new FormData();
    body.append("screenshot", file);
    await supportRequest(`tickets/${ref}/attachment`, { token, body, method: "POST" });
    setFile(null);
  };
  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (file && (!["image/png", "image/jpeg"].includes(file.type) || file.size > 5 * 1024 * 1024)) {
      setError("Choose a JPEG or PNG screenshot up to 5 MB.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      identity.current ||= makeIdentity();
      const data = await supportRequest("tickets", {
        method: "POST",
        body: {
          ...form,
          ...identity.current,
          source: initial.current.get("site") === "cmdanigeria.org" ? "cmdanigeria.org" : "cmdanigeria.net",
        },
      });
      const token = identity.current.accessToken;
      setTicket(data);
      setReference(data.reference);
      setAccessToken(token);
      setCreated(true);
      setMode("track");
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}#${data.reference}:${token}`
      );
      setNotice(
        data.emailSent
          ? "Message received. We’ve emailed your private tracking link."
          : "Message received. Save the private tracking link below; email delivery is not confirmed."
      );
      try {
        await upload(data.reference, token);
      } catch {
        setError("Your message was saved, but the screenshot was not attached. You can retry the upload below.");
      }
    } catch (err) {
      if (err?.queued) {
        setError("");
        setNotice("You’re offline. Your message is queued and will be sent automatically when you’re back online.");
      } else {
        report(err);
      }
    } finally {
      setBusy(false);
    }
  };
  const track = async (e) => {
    e?.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      setTicket(await supportRequest(`tickets/${encodeURIComponent(reference.trim())}`, { token: accessToken.trim() }));
    } catch (err) {
      setTicket(null);
      report(err);
    } finally {
      setBusy(false);
    }
  };
  const sendReply = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      replyId.current ||= crypto.randomUUID();
      setTicket(
        await supportRequest(`tickets/${reference}/replies`, {
          method: "POST",
          token: accessToken,
          body: { message: reply, messageId: replyId.current, version: ticket.revision },
        })
      );
      setReply("");
      replyId.current = null;
      setNotice("Reply sent. Your conversation is back with our team.");
    } catch (err) {
      report(err);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className={`cmda-support ${embedded ? "support-embedded" : "support-page"}`}>
      <header>
        <p className="support-eyebrow">CMDA Nigeria · We’re listening</p>
        <h1>Complaints & feedback</h1>
        <p>Tell us what went wrong or how we can improve. Both CMDA websites reach the same team.</p>
      </header>
      <nav className="support-tabs" aria-label="Support options">
        <button
          type="button"
          aria-pressed={mode === "new"}
          onClick={() => {
            setMode("new");
            setError("");
          }}
        >
          Send a message
        </button>
        <button
          type="button"
          aria-pressed={mode === "track"}
          onClick={() => {
            setMode("track");
            setError("");
          }}
        >
          Track a submission
        </button>
      </nav>
      {error ? (
        <div className="support-notice support-error" role="alert">
          {error}
        </div>
      ) : null}
      {notice ? (
        <div className="support-notice" role="status">
          {notice}
        </div>
      ) : null}
      {mode === "new" && !created ? (
        <form onSubmit={submit} className="support-form">
          <fieldset>
            <legend>What would you like to share?</legend>
            <div className="support-choice">
              {["complaint", "feedback"].map((kind) => (
                <label key={kind}>
                  <input type="radio" name="kind" value={kind} checked={form.kind === kind} onChange={update} />
                  {kind === "complaint" ? "Report a problem" : "Share feedback"}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="support-grid">
            <label>
              Your name
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                value={form.name}
                onChange={update}
              />
            </label>
            <label>
              Email address
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={form.email}
                onChange={update}
              />
            </label>
          </div>
          <label>
            Category
            <select aria-label="Category" name="category" value={form.category} onChange={update}>
              {Object.entries(categories).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Subject
            <input name="subject" required minLength={5} maxLength={150} value={form.subject} onChange={update} />
          </label>
          <label>
            Your message
            <textarea
              name="message"
              aria-label="Your message"
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              value={form.message}
              onChange={update}
              aria-describedby="support-privacy"
            />
            <small>{form.message.length}/5000 characters</small>
          </label>
          <label>
            Screenshot <span>(optional)</span>
            <input type="file" accept="image/png,image/jpeg" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <small>JPEG or PNG, up to 5 MB. Hide sensitive details before uploading.</small>
          </label>
          <label className="support-honeypot" aria-hidden="true">
            Website
            <input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update} />
          </label>
          <p id="support-privacy" className="support-help">
            Your name, email and message will be shared with the CMDA admin team so they can respond. Don’t include
            passwords, card details or private medical information. This is not an emergency service.
          </p>
          <button className="support-primary" disabled={busy}>
            {busy ? "Sending your message…" : "Send message"}
          </button>
        </form>
      ) : mode === "new" ? (
        <div className="support-notice">
          Your message is saved.{" "}
          <button
            type="button"
            onClick={() => {
              setCreated(false);
              identity.current = null;
              setForm({ ...form, subject: "", message: "" });
              setFile(null);
              setNotice("");
            }}
          >
            Start another submission
          </button>
        </div>
      ) : (
        <>
          {!ticket ? (
            <form onSubmit={track} className="support-form">
              <label>
                Submission reference
                <input
                  required
                  value={reference}
                  onChange={(e) => setReference(e.target.value.toUpperCase())}
                  placeholder="CMDA-…"
                />
              </label>
              <label>
                Private access key
                <input
                  type="password"
                  required
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  autoComplete="off"
                />
              </label>
              <p className="support-help">
                Your tracking email contains a link with these details. Keep it private—anyone with the link can read
                and reply.
              </p>
              <button className="support-primary" disabled={busy}>
                {busy ? "Finding your message…" : "View conversation"}
              </button>
            </form>
          ) : (
            <div className="support-form">
              <div className="support-ticket-heading">
                <div>
                  <small>{ticket.reference}</small>
                  <h2>{ticket.subject}</h2>
                </div>
                <span className="support-status">{labels[ticket.status]}</span>
              </div>
              <div className="support-notice">
                <label>
                  Private tracking link
                  <input readOnly value={link} onFocus={(e) => e.target.select()} />
                </label>
                <small>Save this link. Don’t post it publicly.</small>
              </div>
              <div className="support-thread" aria-label="Conversation">
                {ticket.messages.map((message) => (
                  <article key={message.messageId} className={message.author === "team" ? "support-team" : ""}>
                    <div>
                      <strong>{message.author === "team" ? "CMDA team" : "You"}</strong>
                      <time>{new Date(message.createdAt).toLocaleString()}</time>
                    </div>
                    <p>{message.message}</p>
                  </article>
                ))}
              </div>
              <form onSubmit={sendReply}>
                <label>
                  {ticket.status === "resolved" ? "Reply to reopen this conversation" : "Add a reply"}
                  <textarea
                    required
                    minLength={2}
                    maxLength={5000}
                    rows={3}
                    value={reply}
                    onChange={(e) => {
                      setReply(e.target.value);
                      replyId.current = null;
                    }}
                  />
                </label>
                <div className="support-actions">
                  <button className="support-primary" disabled={busy || !reply.trim()}>
                    {busy ? "Please wait…" : "Send reply"}
                  </button>
                  <button type="button" disabled={busy} onClick={track}>
                    Refresh conversation
                  </button>
                </div>
              </form>
              {file ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    setError("");
                    try {
                      await upload(reference, accessToken);
                      setNotice("Screenshot attached.");
                    } catch (err) {
                      report(err);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Retry screenshot upload
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setTicket(null);
                  setNotice("");
                }}
              >
                View another submission
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
SupportPortal.propTypes = { embedded: PropTypes.bool };
