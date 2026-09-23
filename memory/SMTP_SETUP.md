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


## 2026-06 DIAGNOSTIC (important, saves a lot of GoDaddy hunting)
Direct probe of smtp.office365.com:587 with staff@usgoldgymclub.com and a deliberately wrong password:
  AUTH advertised: LOGIN XOAUTH2
  535 5.7.3 Authentication unsuccessful
That is the WRONG-PASSWORD error, not 535 5.7.139 "SmtpClientAuthentication is disabled for the mailbox".
=> Authenticated SMTP is ALREADY ENABLED for this mailbox and basic AUTH LOGIN is available.
=> No GoDaddy toggle and no admin change is required. All that's missing is a valid password:
   - the mailbox's normal password works if MFA isn't enforced on that account
   - an app password is only needed if 2-step is on
Re-run this probe after any change to confirm which failure we're facing.


## 2026-09-23 ROOT CAUSE of "staff@usgoldgymclub.com can't receive mail yet" (read the video frames)
GoDaddy page productivity.godaddy.com/#/mailbox/15641450 shows:
  - yellow banner "staff@usgoldgymclub.com can't receive mail yet" + "Help me fix this"
  - Manage: Password | Aliases | Forwarding | Set mail destination
  - Setup: mobile | desktop | Create email signature | Recheck DNS
  - Account information: First name "staff", Account type "Email Essentials",
    Administrator permissions: No, plus an "Advanced Settings" link
DNS check (2026-09-23):
  NS      -> ns1/ns2/ns3.mdnsservice.com  (old host's DNS, NOT Cloudflare/GoDaddy)
  MX      -> 0 smtp.secureserver.net / 10 mailstore1.secureserver.net  (legacy GoDaddy Workspace)
  SPF TXT -> v=spf1 include:spf.protection.outlook.com -all  (already Microsoft)
  autodiscover CNAME -> NXDOMAIN ; DKIM selector1 -> NXDOMAIN ; _dmarc -> NXDOMAIN
=> The mailbox is Microsoft-backed but MX still routes inbound mail to GoDaddy's legacy servers, so the
   new mailbox receives nothing. SENDING via smtp.office365.com is unaffected (auth probe succeeded),
   which is why the website could still send while staff sees nothing.
FIXES:
  A) Point MX at Microsoft (GoDaddy banner "Help me fix this" / "Set mail destination" shows the exact
     value, normally usgoldgymclub-com.mail.protection.outlook.com) + add autodiscover CNAME
     autodiscover.outlook.com. Must be done wherever ns*.mdnsservice.com is managed (old web host).
  B) INTERIM (recommended, zero DNS work): set STAFF_TO=usgoldgym@gmail.com - the Gmail account already
     used for the gym's Google Calendar - so notifications are readable today. Switch back to staff@
     once MX is corrected.
Password: only Manage -> Password (set a fresh one) is needed; SMTP AUTH is already on for the mailbox.


## 2026-09-23 LIVE - email notifications are WORKING
- DNS verified from outside: MX -> usgoldgymclub-com.mail.protection.outlook.com (prio 0),
  autodiscover CNAME -> autodiscover.outlook.com, SPF unchanged, old homesteadmail CNAMEs gone.
  Microsoft's MX answered "250 2.1.5 Recipient OK" for staff@usgoldgymclub.com, so inbound works.
- SMTP AUTH verified with the mailbox password the user supplied; SMTP_PASSWORD now set in backend/.env.
- End-to-end: POST /api/admin/email/test, /api/contact, /api/leads, /api/newsletter all logged
  "Staff notification sent" and "Parent confirmation sent". Test rows deleted from Mongo afterwards.
- STILL REQUIRED FOR PRODUCTION: add SMTP_PASSWORD (and SMTP_HOST/PORT/USERNAME/MAIL_FROM/STAFF_TO)
  to Emergent deployment secrets, then re-publish - .env only covers preview.
- Credentials note: password is the staff@ mailbox password (user-supplied, not an app password).
  If the gym ever rotates it, SMTP_PASSWORD must be updated in .env AND deployment secrets.
