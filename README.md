# Matcha God Proposal + Invoice

This package contains the current Matcha God proposal page plus the invoice/onboarding page with Resend form submission.

## Routes

- `/` loads the proposal page through `vercel.json`.
- `/matcha-god-proposal` loads the proposal page when Vercel clean URLs are enabled.
- `/invoice` loads the invoice/onboarding page.
- `/api/send-onboarding` sends onboarding form answers through Resend.

## Required Vercel Environment Variables

Add these in Vercel → Project → Settings → Environment Variables:

```txt
RESEND_API_KEY=re_...
FROM_EMAIL=Emma Cast Creative <hello@eccreativestudios.com>
ONBOARDING_TO=hello@eccreativestudios.com
```

`FROM_EMAIL` must be a verified sender/domain inside Resend.

## Upload to GitHub

Upload the contents of this folder into the root of your GitHub repo:

```txt
matcha-god-proposal.html
vercel.json
package.json
README.md
api/send-onboarding.js
invoice/index.html
```

Do not upload the ZIP file itself into the repo. Upload the extracted files/folders.
