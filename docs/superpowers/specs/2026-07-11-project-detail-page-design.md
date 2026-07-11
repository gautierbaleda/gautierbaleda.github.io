# Page détail projet enrichie — design

## Contexte

La page `/projets/[slug]` actuelle (`portfolio-next/app/projets/[slug]/page.tsx`) n'affiche qu'un bandeau hero minimal (nom, titre, description, tags). Le bundle de référence Claude Design (`Portfolio.dc.html`, section "PROJECT DETAIL OVERLAY", lignes ~660-760) contient une page détail bien plus riche : breadcrumb, image de couverture, sections éditoriales "Problématique" / "Approche et solution", grille de fonctionnalités clés, carousel de captures d'écran, et deux CTA finaux.

Ce spec couvre la reconstruction de cette page détail dans l'architecture Next.js + Keystatic actuelle, sans réintroduire le comportement d'overlay SPA de l'original.

## Décision d'architecture

La page reste une **route séparée** `/projets/[slug]` (server-rendered, URL partageable), **pas un overlay** au-dessus de la liste `/projets`. On simule la sensation de "glissement depuis la droite" du bundle original via une **animation d'entrée au montage** (translateX), pas une vraie transition partagée entre les deux routes.

Justification : cohérent avec l'architecture Next.js actuelle (routes normales, pas de SPA client-only), pas de dépendance à une API expérimentale (View Transitions), et réutilise un pattern déjà validé dans le code (`Hero.tsx`).

## Modèle de contenu (Keystatic)

Fichier : `portfolio-next/keystatic.config.ts`, collection `projects`.

Champs actuels conservés : `name`, `longName`, `description`, `tags`, `bg`, `textColor`.

Nouveaux champs :

| Champ | Type Keystatic | Notes |
|---|---|---|
| `year` | `fields.text` | Texte court, ex. "2025" |
| `problematique` | `fields.document` | Rich text : gras, titres (h1/h2), images, listes |
| `approche` | `fields.document` | Rich text, mêmes capacités |
| `features` | `fields.array` de `fields.object({ icon: fields.select(...), title: fields.text, description: fields.text })` | `icon` : select à choix fixe parmi `zap`, `layers`, `shield`, `rocket`, `code`, `users` |
| `screenshotsCount` | `fields.integer` | Valeur 1 à 3. Pas de vrais fichiers image par projet pour l'instant : chaque slide du carousel est un bloc placeholder teinté (dérivé de `bg`) avec label "Capture N" |
| `externalUrl` | `fields.text` (optionnel) | URL du bouton "Voir le projet →". Si vide/absent, le bouton est masqué |

Chaque fichier existant dans `content/projects/*.json` (`projet-un.json`, `projet-deux.json`, `projet-trois.json`, `projet-quatre.json`, `projet5.json`, `projet6.json`, `projet-six-copy.json`) reçoit du contenu placeholder cohérent pour ces nouveaux champs (dans le même esprit que les descriptions courtes placeholder actuelles), éditable ensuite via l'interface Keystatic par l'utilisateur.

`content/projects.ts` (le `Project` type + `getProjects`/`getProjectBySlug`) est étendu pour exposer ces champs. Les champs `document` (`problematique`, `approche`) sont retournés sous forme d'`unknown`/structure Keystatic brute, à rendre côté page via `DocumentRenderer` de `@keystatic/core/renderer` (pas de transformation en string côté `content/projects.ts`).

## Structure de la page

Fichier : `portfolio-next/app/projets/[slug]/page.tsx`. Conteneur interne `max-w-[820px] mx-auto`.

1. **Bandeau hero** (fond `project.bg`, texte `project.textColor`) :
   - Breadcrumb sticky (`position: sticky; top: 0`, fond flouté `backdrop-filter: blur(12px)`), **visible sur toute la hauteur de la page** (pas seulement dans le bandeau) : lien "Projets" (couleur accent, retour à `/projets`) + séparateur "/" + nom court du projet (`project.name`).
   - Titre (`h1`, `project.longName`) + `project.year` en dessous.
   - `project.description`.
   - Tags en pills (fond blanc translucide, comme actuellement).
   - Image de couverture : bloc placeholder pleine largeur, 260px de haut, coins arrondis, teinte dérivée de `project.bg`.

2. **Corps éditorial** (padding généreux) :
   - Paragraphe de contexte libre (texte statique d'intro, pas de nouveau champ dédié — réutilise `description` ou un texte de transition générique).
   - Section "Problématique" (`h2` + `DocumentRenderer` sur `project.problematique`).
   - Section "Approche et solution" (`h2` + `DocumentRenderer` sur `project.approche`).
   - Grille 2 colonnes "Fonctionnalités clés" : une card par entrée de `project.features` (fond `#F7F5F0`, radius 16px) = icône 36px (`lucide-react`, mappée depuis `feature.icon`) + titre bold + description.
   - Carousel de captures d'écran (voir composant `ProjectCarousel` ci-dessous), alimenté par `project.screenshotsCount` slides placeholder.

3. **CTA finaux** :
   - "Voir le projet →" : lien externe vers `project.externalUrl`, `target="_blank"`, **masqué si `externalUrl` est vide**.
   - "Me contacter" : lien vers `/#contact` (section `Footer` existante, qui a déjà `id="contact"`).

## Nouveaux composants

- **`components/site/ProjectDetailReveal.tsx`** — wrapper client. Reprend le pattern de `Hero.tsx` (`components/site/Hero.tsx:20-35`) : `useState(false)` + double `requestAnimationFrame` pour déclencher `setVisible(true)` après le premier paint, classe CSS conditionnelle appliquant `transform: translateX(100%)` → `translateX(0)` avec `transition: transform 0.48s cubic-bezier(0.22, 0.9, 0.25, 1)`. Enveloppe tout le contenu de la page détail.

- **`components/site/ProjectCarousel.tsx`** — client component, `screenshotsCount: number` en prop. State local `idx` (index actif). Slides en `position: absolute` avec crossfade d'opacité (`transition: opacity 0.4s`) et `pointer-events` conditionnés à l'état actif. Badge compteur "x / N" en haut à droite. Flèches prev/next rondes blanches avec ombre (navigation manuelle uniquement, pas d'auto-play). Dots de pagination en dessous (dot actif plus large + couleur foncée).

- Mapping icônes `lucide-react` : petit objet `Record<string, LucideIcon>` colocalisé dans le fichier de la grille features (ou directement dans `page.tsx` si la grille n'est pas extraite en composant séparé), couvrant les clés `zap`, `layers`, `shield`, `rocket`, `code`, `users`.

## Hors périmètre

- Pas de vraies images de couverture/captures d'écran par projet (placeholders colorés pour l'instant — l'utilisateur remplacera via Keystatic plus tard, ce qui pourra nécessiter un futur ajustement du schéma vers un champ `image`).
- Pas d'overlay SPA, pas de View Transitions API.
- Pas d'auto-play sur le carousel.
- Pas de nouveau champ pour le "paragraphe de contexte libre" en tête de corps éditorial — réutilisation de contenu existant.
