# Matcha God Proposal + Invoice

## Routes

- `/` loads the proposal page from `index.html`
- `/proposal` also loads the proposal page
- `/invoice` loads the invoice + onboarding page
- `/api/send-onboarding` sends onboarding answers through Resend

## Required Vercel Environment Variables

Add these in Vercel → Project → Settings → Environment Variables:

```txt
RESEND_API_KEY=re_...
FROM_EMAIL=Emma Cast Creative <hello@eccreativestudios.com>
ONBOARDING_TO=hello@eccreativestudios.com
```

## Upload rule

Upload the contents of this folder to the root of GitHub. Do not upload the folder itself and do not upload the ZIP itself.

## Common 404 fix

Vercel needs `index.html` at the root for the homepage. This package includes it.


Update: onboarding form now requires client name and email. Submitted emails use the client email as reply-to.
