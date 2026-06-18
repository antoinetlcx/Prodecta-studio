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

Cette version est volontairement simple pour valider le rendu et le parcours :

- builder guidé ;
- structure imposée ;
- preview en direct ;
- overlay Matterport premium ;
- vrai menu latéral gauche ;
- bouton plein écran pour masquer l'interface ;
- rendu mobile-first ;
- sauvegarde navigateur ;
- URL publique locale `/v/[slug]` ;
- URL partageable via fragment encodé lorsque le projet n'est pas trop lourd.

## Prochaines étapes

- Supabase pour stocker tous les projets ;
- auth client ;
- Stripe ;
- sous-domaines `client.prodecta.app` ;
- dashboard analytics ;
- espace Matterportiste avec multi-projets.
