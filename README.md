<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6f5858c8-2318-4120-9787-e357be0f87ca

## Run Locally

Create a .env.local file with the MongoDB variables from .env.example.
The server loads .env.local and .env; it does not load .env.example.

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Production

The live deployment must define the MongoDB variables plus the WhatsApp Cloud API
variables in `.env.example`. `WHATSAPP_OTP_TEMPLATE_NAME` must point to an
approved authentication template that accepts the code as its first body
variable. For MongoDB Atlas, add the deployment's outbound network access to
the Atlas IP access list. Check `/api/health` after deploying; it should return
`{"ok":true,"database":"connected"}` before testing the form.

For local development without sending real messages, set
`WHATSAPP_OTP_MODE=console`. The generated code will be printed by the server
and the rest of the verification flow remains enabled. Use `WHATSAPP_OTP_MODE=meta`
with real Meta credentials for actual WhatsApp delivery.

Build the frontend and start the Express server so the `/api/leads`,
`/api/leaderboard`, and `/api/scores` routes are available in the deployed app:

`npm run build && npm start`
