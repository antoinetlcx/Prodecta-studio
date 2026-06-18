# Prodecta Studio MVP

MVP Next.js pour créer une app web immersive à partir d'un lien Matterport.

Le client va sur `/studio`, colle son lien Matterport, choisit son secteur, ses couleurs, son logo, ses sections et son CTA. Il publie ensuite une URL `/v/[slug]`.

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrir :

```txt
http://localhost:3000
http://localhost:3000/studio
```

## Version actuelle

Cette version reprend la structure des apps immersives Prodecta :

- visite virtuelle en fond ;
- dock / menu latéral premium ;
- modules par sections ;
- topbar immersive ;
- CTA principal ;
- actions rapides ;
- bottom navigation mobile ;
- mode plein écran qui masque toute l'interface ;
- publication locale avec URL `/v/[slug]`.

## Prochaines étapes

- Supabase pour stocker tous les projets ;
- auth client ;
- Stripe ;
- sous-domaines `client.prodecta.app` ;
- dashboard analytics ;
- espace Matterportiste avec multi-projets.
