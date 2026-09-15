# Email notifications setup — staff@usgoldgymclub.com (Microsoft 365)

Everything on the website side is **already built and deployed**. The only thing missing is one
password. Until it's added, every form still saves to your admin dashboard — you just don't get
the email yet.

---

## What you'll get once it's on

| Form | Staff email | Parent gets |
|---|---|---|
| Contact form (all 7 topics) | ✅ | "We got your message" |
| Request pricing / class enrollment | ✅ | ✅ |
| Birthday party + event sign-up requests (these go through the contact form) | ✅ | ✅ |
| Email list signup | ✅ | Welcome note |

- Every notification arrives **from** staff@usgoldgymclub.com and lands **in** staff@usgoldgymclub.com.
- **Hit Reply and you're replying to the parent** — their address is set as the reply-to.
- Sent copies appear in the staff mailbox's Sent Items.

---

## Step 1 — Turn on "Authenticated SMTP" for the mailbox

Someone with Microsoft 365 admin rights does this once:

1. Go to **admin.microsoft.com** → **Users** → **Active users**.
2. Click **staff@usgoldgymclub.com**.
3. Open the **Mail** tab → **Manage email apps**.
4. Tick **Authenticated SMTP** → **Save changes**.

If that checkbox is greyed out, your tenant has SMTP turned off globally. An admin can allow just
this one mailbox in Exchange PowerShell:

```powershell
Connect-ExchangeOnline
Set-CASMailbox -Identity "staff@usgoldgymclub.com" -SmtpClientAuthenticationDisabled $false
```

## Step 2 — Create an app password

1. Sign in as **staff@usgoldgymclub.com** at **myaccount.microsoft.com**.
2. Go to **Security info**.
3. **Add sign-in method** → **App password**.
4. Name it `Website Forms` → **Next**.
5. Copy the 16-character password Microsoft shows you (it's shown only once).

**If you don't see "App password":** multi-factor authentication isn't enabled for that account, or
your admin has app passwords disabled. Ask the admin to enable app passwords, or tell me and I'll
switch us to Resend instead (5-minute setup, one DNS record, equally reliable).

## Step 3 — Send it to me

Paste the app password in the chat (not the mailbox's normal password). I'll store it as an
encrypted secret — never in the code or in GitHub — and then:

1. Send a live test to staff@usgoldgymclub.com so you can confirm it arrives.
2. Submit each form end-to-end and confirm both emails (staff + parent).

---

## Notes for future me (technical)

- Implementation: `/app/backend/mailer.py`, wired into `/api/contact`, `/api/leads`,
  `/api/newsletter`, `/api/bookings` via FastAPI `BackgroundTasks`.
- Sending is a **no-op** unless all of `SMTP_HOST`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `MAIL_FROM`,
  `STAFF_TO` are set — forms never fail because email isn't configured. Logs
  "Email not configured — skipped staff notification".
- Env keys live in `backend/.env` (preview) and must also be added to **deployment secrets** for
  production. `SMTP_PASSWORD` is intentionally empty in the repo.
- Retries: 3 attempts with 1s/2s backoff (`aiosmtplib`, port 587, STARTTLS).
- Admin helpers: `POST /api/admin/email/test` (sends a test), `GET /api/admin/email/status`.
- Deliverability: M365 SPF/DKIM already cover the domain since mail is hosted there — no DNS change
  needed for this route (Resend/SendGrid would need one).
- Microsoft's timeline: basic SMTP AUTH keeps working through **December 2026**, then it's off by
  default. Long-term move is Microsoft Graph `Mail.Send` with client credentials, or a transactional
  provider. Revisit before the end of 2026.
