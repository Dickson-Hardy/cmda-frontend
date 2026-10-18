# Complaints and feedback rollout

## Scope

Both sites use the same backend and admin inbox: **Complaints & feedback** (`/support` in admin). Super Admin, Member Manager and Finance Manager may review all submissions, assign to themselves, reply, and change status. Member replies reopen resolved conversations. A support status change never confirms or credits a payment.

Members and visitors can submit without logging in (including login complaints). The public page is `/support`; the isolated widget view is `/support/embed`. Each submission returns a reference and a random private access key. Only the hash is stored in MongoDB. The tracking link keeps the key in a URL fragment, not a query string. Anyone with that private link can read and reply: treat it like a password. There is no public email search or reference-only lookup.

## Deployment order

1. Deploy backend with SupportModule, using existing MongoDB, email and Cloudinary configuration. No new secrets are required. Verify indexes are created, email is available, and per-client rate limiting is correct behind the production proxy.
   When Heroku's `DYNO` marker is present, the backend trusts only the immediate router hop for client IP addressing. Heroku appends the connecting client IP to the right of `X-Forwarded-For`: https://devcenter.heroku.com/articles/http-routing#heroku-headers. Other hosting configurations require their own explicit proxy policy; never trust every forwarded hop.
2. Deploy the `.net` frontend and admin. Confirm the hosting platform applies `public/_headers`: only `/support/embed` should allow framing by the two CMDA domains; other app routes must remain non-frameable. Cloudflare Pages supports removing an inherited header with `! Content-Security-Policy` before applying the route-specific policy: https://developers.cloudflare.com/pages/configuration/headers/.
3. In WordPress on cmdanigeria.org, add the following once through the site's approved custom-code/footer mechanism (the WordPress repository is not in this workspace):

```html
<script defer src="https://cmdanigeria.net/cmda-feedback.js"></script>
```

If `.org` has a CSP, allow `https://cmdanigeria.net` in `script-src` and `frame-src`. Do not loosen other directives. The script reads only the hostname, does not inspect the page, and loads the iframe only when opened. There is also an “Open in a new tab” fallback.

## Verification before launch

- Submit one complaint and one feedback entry from each site; confirm the source label in the shared inbox. Source is reported by the client and is for sorting, not an authorization decision.
- Save the private link and reload it. Confirm another token cannot access the same conversation.
- Upload a PNG and JPEG screenshot, open them as admin, and confirm private download links expire after five minutes. Invalid types and files over 5 MB must be rejected. One screenshot is allowed per submission.
- Reply as admin, check email acknowledgement/reply/status notifications, then reply as the sender. Verify assignment, filters and pagination.
- Test failed email and screenshot uploads: the ticket must stay saved and the UI must not claim an email arrived. Screenshots must not be attached publicly.
- Check mobile widths, keyboard navigation, close/Escape and fallback links on both sites. Native mobile has a More → Complaints & feedback browser entry point, requiring a new app release.
- No public submissions or real support emails should be created merely to smoke-test production without an agreed test recipient.

## Feedback conventions

Local form validation stays with the field. Long-lived errors and submission confirmations stay on screen. Toasts are limited to two visible notices, use readable light styling, and never show backend stack traces. Background query errors are handled by their screen, not a global toast. Mutations that render their own errors set `extraOptions: { handlesError: true }` so the middleware does not duplicate them. Error actions always reach reducers. Server errors include a diagnostic request ID; private support GET responses are `no-store` and excluded from the PWA API cache.

## Operational follow-ups

Agree internal response targets, retention/deletion policy for complaints and screenshots, support-team ownership, and escalation rules before general launch. Rate limiting and a honeypot are included; add a verified anti-bot challenge if abuse appears. Email notifications use the existing delivery system; the private tracking conversation is the source of truth if email delivery is unavailable. There is no email-to-ticket reply ingestion or anonymous access-key recovery in this version.
