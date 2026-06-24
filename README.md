# Zoho Payment Gate

This is a small Vercel/Next.js app for Zoho CRM payment schedule links.

When someone opens:

```text
https://your-vercel-domain.vercel.app/p/{payment_schedule_record_id}
```

the app checks the Zoho CRM Payment Schedule record:

- If the status is `Pending`, it redirects to the Zoho Form link saved on that record.
- If the status is anything else, it shows a simple "payment already completed" page.

## Setup

1. In Zoho CRM, find the API names for:
   - Payment Schedule module
   - Status field
   - Zoho Form link field

   Zoho lists custom module API names in Setup -> Developer Hub -> APIs & SDKs -> API Names.

2. Create a Zoho OAuth client and generate a refresh token with read access to the payment schedule module.

   Minimum CRM scope:

   ```text
   ZohoCRM.modules.custom.READ
   ```

   If you prefer broad access during initial testing, use:

   ```text
   ZohoCRM.modules.ALL
   ```

3. Copy `.env.example` to `.env.local` for local development and fill in your values.

   For India data center:

   ```text
   ZOHO_ACCOUNTS_BASE_URL=https://accounts.zoho.in
   ZOHO_API_BASE_URL=https://www.zohoapis.in
   ```

   For US data center:

   ```text
   ZOHO_ACCOUNTS_BASE_URL=https://accounts.zoho.com
   ZOHO_API_BASE_URL=https://www.zohoapis.com
   ```

4. Run locally:

   ```bash
   npm install
   npm run dev
   ```

5. Deploy the project folder to Vercel and add the same environment variables in Vercel Project Settings.

## Zoho CRM Link Format

In your Payment Schedule module, make the clickable link point to:

```text
https://your-vercel-domain.vercel.app/p/${Payment_Schedule_Record_ID}
```

Replace `${Payment_Schedule_Record_ID}` with the CRM record ID merge field available in your Zoho setup.

## Notes

- Do not call Zoho CRM directly from browser JavaScript. The client secret and refresh token must stay in Vercel environment variables.
- The app refreshes a Zoho access token server-side for each request.
- If your status values are different, update `PENDING_STATUS_VALUES`, for example:

  ```text
  PENDING_STATUS_VALUES=Pending,Payment Pending,Unpaid
  ```
