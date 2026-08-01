Provisioning guide (staging) — IUM-MORAVE

Ce guide explique comment provisionner une infra de staging minimale à partir des templates fournis (infra/terraform).

Prérequis :
- Compte AWS (ou adapter les templates pour DigitalOcean/GCP)
- Terraform installé
- Accès GitHub pour ajouter secrets (DB_URL, STORAGE_KEY, SMTP_KEY)

Étapes :
1. Copier infra/terraform/terraform.tfvars.example vers infra/terraform/terraform.tfvars et renseigner les variables.
2. Dans infra/terraform : terraform init
3. terraform plan -var-file=terraform.tfvars
4. terraform apply -var-file=terraform.tfvars
5. Après apply, récupérer les outputs (db_endpoint, assets_bucket)
6. Dans GitHub repo Settings -> Secrets, ajouter :
   - IUM_DB_URL (postgres://user:password@db_endpoint:5432/iumdb)
   - IUM_ASSETS_BUCKET (assets bucket name)
   - IUM_S3_KEY / IUM_S3_SECRET (if needed)
   - IUM_SMTP_KEY (email provider)

Notes :
- Pour la production, utilisez des plans RDS plus robustes, backups automatisees et surveillance.
- Validez la restauration des backups sur un restore test.
