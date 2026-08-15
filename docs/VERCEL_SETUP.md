Préparation pour déploiement sur Vercel

Recommandation : utiliser Vercel pour le frontend Next.js (préviews GitHub) et connecter l'API (si nécessaire) en tant que projet séparé.

Étapes rapides :

1. Connecter le dépôt GitHub à Vercel via "Import Project".
2. Dans les Settings du projet Vercel, ajouter les variables d'environnement (names):
   - NEXT_PUBLIC_SUPABASE_URL -> ${SUPABASE_URL}
   - NEXT_PUBLIC_SUPABASE_ANON_KEY -> ${SUPABASE_ANON_KEY}
   - SUPABASE_SERVICE_ROLE -> ${SUPABASE_SERVICE_ROLE} (si utilisé côté serveur uniquement)
   - JWT_SECRET -> ${JWT_SECRET}
   - DB_URL -> ${DB_URL} (si l'API doit se connecter directement à la base Postgres)
3. Activer les Preview Deployments pour les pull requests (option par défaut sur Vercel).
4. Définir la commande de build: npm run build (apps/web)
5. Déployer et vérifier les previews.

Remarque : pour déployer l'API Node/Express, soit déployer sur une plateforme server (Railway/Render/Heroku) et renseigner les mêmes secrets, soit transformer l'API en Serverless et héberger sur Vercel (requiert adaptation).