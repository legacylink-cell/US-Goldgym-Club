# Email notifications setup - staff@usgoldgymclub.com

The website side is **built and deployed-ready**. It stays dormant unti…4714 chars truncated…lient credentials, or move to Resend. Track this before then.
- Never commit SMTP_PASSWORD to git; it lives in .env locally and deployment secrets in production.


## 2026-06 findings from the user's screen recording (GoDaddy UI)
Mailbox page for staff@usgoldgymclub.com shows: Manage (Aliases / Forwarding / Password),
Setup (desktop / mobile / Recheck DNS / signature), Account Information, "Administrator permissions: No",
"Account type: User", and an **Advanced settings** link. There is NO 2-step verification option in
GoDaddy's mailbox page - that lives on Microsoft's side (myaccount.microsoft.com -> Security info) and
must be done while signed in AS staff@usgoldgymclub.com.
The recording also showed a warning "This email address is not currently active - verify your domain or
contact us", which must be resolved first (a mailbox that isn't fully provisioned cannot send via SMTP).

Decision tree given to the user:
1. GoDaddy mailbox page -> Advanced settings -> look for "Authenticated SMTP" / "Email apps" -> enable.
2. Microsoft side (signed in as the mailbox): myaccount.microsoft.com -> Security info -> add an
   authenticator/phone method (that IS the 2-step step) -> then "App password".
3. If app passwords are unavailable (tenant/admin blocked) -> switch to Resend (one Cloudflare DNS
   record, ~5 min, better deliverability). RECOMMENDED if step 2 stalls.
4. Alternative discussed: a dedicated website@ mailbox with its own password (no MFA needed) forwarding
   to staff@ - avoids sharing the staff mailbox password.
