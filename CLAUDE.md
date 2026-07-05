# Portfolio — Gautier Baleda

## État actuel

Ce dossier contient l'export d'un portfolio conçu avec **Claude Design** (Anthropic), pas un projet de code standard. Il n'y a pas de repo git initialisé.

Fichiers principaux :
- `Gautier Baleda - Portfolio.html` / `About Gautier Baleda.html` — exports **autonomes** (bundle complet : HTML/CSS/JS + assets en base64 dans des balises `<script type="__bundler/...">`). Ouvrables tels quels dans un navigateur, mais **non éditables directement** — ce sont des bundles générés, pas du code source.
- `*.dc.html` (`About.dc.html`, `Portfolio.dc.html`, `ColorProposals.dc.html`, `AnimationIdeas.dc.html`, `PlaygroundDemo.dc.html`, `Portfolio-standalone-src.dc.html`) — variantes/exports internes de Claude Design, format propriétaire, pas destinés à être ouverts/édités hors de l'outil.
- `support.js`, `image-slot.js` — scripts runtime du bundler Claude Design (gestion des slots d'images, etc.), pas du code applicatif réutilisable.
- `assets/`, `uploads/`, `screenshots/` — images sources utilisées dans le design (photos, sprites, captures d'écran de référence).
- `.image-slots.state.json`, `.thumbnail` — métadonnées internes de l'outil Claude Design.

## Objectif en cours : migration vers Next.js + Tailwind + shadcn/ui + Keystatic

Le format bundlé actuel ne permet pas d'intégrer un CMS (Keystatic a besoin de collections de contenu structurées type Markdoc/JSON dans un projet Next.js classique). La cible :

- **Next.js** (App Router) comme framework.
- **Tailwind CSS** pour le style, en recréant la palette/design visible dans le bundle actuel (ex. props `accentColor: #FFC800`, `pageBackground: #F7F5F0`, `cardBackground: #FFFFFF`).
- **shadcn/ui** pour les composants de base, personnalisés par-dessus.
- **Keystatic** pour la gestion de contenu (textes, projets, images) une fois la structure de composants en place.

**Important** : il n'existe pas de conversion automatique du HTML bundlé vers React. Le travail consiste à reconstruire chaque section à la main (layout, texte, images) en s'appuyant sur le rendu visuel actuel comme référence, pas sur le code source du bundle.

## Notes de collaboration

- Le design de référence est à observer en ouvrant les fichiers `.html` autonomes dans un navigateur (`open "Gautier Baleda - Portfolio.html"`), pas en lisant leur code source.
- Les images sources à réutiliser dans la migration sont dans `uploads/` et `assets/`.
