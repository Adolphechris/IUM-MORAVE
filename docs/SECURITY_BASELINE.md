SECURITY BASELINE (initial)

1. Secrets & Credentials
- Use GitHub Secrets for credentials (DB_URL, STORAGE_KEY, SMTP, OAUTH secrets).
- Never commit secrets to repo.

2. Email & Deliverability
- Setup SPF, DKIM and DMARC records for the official domain.
- Use a transactional email provider (SendGrid, Mailgun) with API keys in secrets.

3. Access Control
- Enforce strong passwords and MFA for all admin accounts.
- Principle of least privilege for service accounts.

4. Backups
- Automated daily backups for DB and weekly full backups stored offsite.
- Test restore monthly.

5. Monitoring & Logging
- Centralize logs (Sentry, ELK) and setup alerts for errors and anomalies.
- IAM audit logs to be retained for investigations.

6. Deployment Security
- Use HTTPS everywhere; enforce HSTS.
- Use a WAF for public endpoints.

7. Incident Response
- Maintain runbook: incident triage, communication plan, rollback steps.

8. Developer Hygiene
- Linting and tests in CI; require PR reviews and passing status checks.

This is a starter baseline; expand with detailed operational procedures before production.
