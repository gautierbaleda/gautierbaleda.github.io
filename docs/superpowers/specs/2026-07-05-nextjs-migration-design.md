# Migration du portfolio vers Next.js + Tailwind + shadcn/ui

Date : 2026-07-05

## Contexte

Le portfolio de Gautier Baleda existe actuellement comme un export autonome de Claude Design : des fichiers HTML bundlés (base64, scripts `__bundler/*`), non éditables ni intégrables à un CMS. L'objectif final est de gérer le contenu via **Keystatic**, ce qui nécessite d'abord une base de code standard en **Next.js**. Ce spec couvre uniquement la migration technique du site vers Next.js + Tailwind + shadcn/ui, avec un contenu en dur. L'intégration de Keystatic fera l'objet d'un projet séparé, une fois cette base stabilisée.

## Périmètre

- Site complet : Accueil, Projets (grille + pages de détail par projet), À Propos.
- Reproduction fidèle du design actuel (couleurs, layout, typographie, formes décoratives).
- Reproduction des animations/interactions visibles dans le bundle actuel.
- Contenu des pages Accueil / À Propos / Stack : repris fidèlement depuis le rendu actuel du bundle.
- Contenu des projets : volontairement **générique et minimal** (titre, slug, résumé court, 1-2 tags, image de couverture) — le contenu détaillé sera ressaisi plus tard via Keystatic, donc pas la peine de le peaufiner maintenant.

## Hors périmètre

- Intégration de Keystatic (projet suivant).
- Migration des fichiers `.dc.html` (variantes internes de l'outil Claude Design, pas des pages du site).
- Backend/API — le site reste statique.
- Améliorations ou modernisations visuelles non présentes dans le design actuel.

## Architecture

Nouveau projet Next.js (App Router, TypeScript, npm) créé dans `./portfolio-next`, à côté des fichiers Claude Design existants qui restent comme référence tant que la migration n'est pas terminée.

```
portfolio-next/
  app/
    layout.tsx              # nav + footer communs
    page.tsx                # Accueil
    projets/
      page.tsx              # grille de projets
      [slug]/page.tsx       # détail d'un projet
    a-propos/page.tsx
  components/
    ui/                      # composants shadcn
    site/                    # Nav, Hero, StackGrid, ProjectCard, ProjectGrid, Footer
  content/
    projects.ts              # tableau typé des projets (deviendra le schéma Keystatic)
  public/
    images/                  # assets copiés depuis uploads/ et assets/
  lib/
    utils.ts
  tailwind.config.ts
```

`content/projects.ts` est un simple tableau TypeScript. Sa forme (champs, types) est pensée pour être reprise telle quelle comme schéma de collection Keystatic dans le projet suivant.

## Extraction du contenu et des assets

Le bundle actuel étant encodé, le contenu ne peut pas être extrait par lecture de code source. Méthode :

- Ouvrir `Gautier Baleda - Portfolio.html` et `About Gautier Baleda.html` dans un navigateur et parcourir chaque section visuellement pour retranscrire fidèlement textes et structure (Accueil, À Propos, Stack).
- Copier les images utiles directement depuis `uploads/` et `assets/` (fichiers déjà présents séparément, pas seulement encodés en base64) vers `portfolio-next/public/images/`.
- Pour la page Projets, identifier chaque projet distinct visible et créer une entrée générique par projet dans `content/projects.ts` (voir Périmètre).
- Tout texte ou détail ambigu/illisible à l'écran sera signalé plutôt qu'inventé.

## Design system

- **Thème Tailwind** : transposition des tokens visibles dans le bundle (`accentColor: #FFC800`, `pageBackground: #F7F5F0`, `cardBackground: #FFFFFF`, noir pour CTA/texte fort) en configuration Tailwind (`tailwind.config.ts` + variables CSS compatibles shadcn).
- **shadcn/ui** : composants de base installés via `npx shadcn@latest add ...` (Button, Card, Badge, NavigationMenu), stylés avec le thème ci-dessus.
- Les formes géométriques décoratives (cercle/carré/losange jaunes du hero) sont des `div` Tailwind, pas des images.
- **Composants site** (`components/site/`) : `Nav`, `Hero`, `StackGrid`, `ProjectCard`, `ProjectGrid`, `Footer`. Chacun reçoit ses données en props, sans logique de contenu interne, pour rester compatible avec l'arrivée de Keystatic ensuite.

## Animations

- **Framer Motion** pour les animations d'entrée (fade/slide au scroll) et micro-interactions (hover sur cartes projet, boutons).
- Formes géométriques du hero : animation flottante douce (translate/rotate en boucle), en CSS/Tailwind si simple, en Framer Motion si plus complexe.
- Les animations à reproduire sont celles observées concrètement en interagissant avec le bundle actuel, pas des ajouts inventés.

## Tests / validation

- Validation visuelle manuelle : comparer chaque page migrée au rendu du bundle actuel (côte à côte).
- Pas de tests automatisés prévus à ce stade (site vitrine statique, contenu amené à changer avec Keystatic).

## Prochaines étapes

Après validation de ce spec, passage à `writing-plans` pour découper la migration en un plan d'implémentation détaillé (setup projet → thème → composants → pages → animations → assets → validation visuelle).
