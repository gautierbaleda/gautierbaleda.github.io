import { config, collection, fields } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    projects: collection({
      label: "Projets",
      slugField: "slug",
      path: "content/projects/*/",
      format: { data: "json" },
      schema: {
        slug: fields.slug({ name: { label: "Slug" } }),
        visible: fields.checkbox({
          label: "Visible",
          description: "Décoche pour masquer ce projet du site public.",
          defaultValue: true,
        }),
        ordre: fields.integer({
          label: "Ordre",
          description: "Détermine l'ordre d'affichage des projets (croissant).",
          defaultValue: 100,
          validation: { isRequired: true },
        }),
        name: fields.text({ label: "Nom court" }),
        longName: fields.text({ label: "Nom long" }),
        description: fields.text({
          label: "Description courte",
          description: "Affichée sur la carte et en haut de la page projet.",
          multiline: true,
        }),
        hoverImage: fields.image({
          label: "Visuel au survol",
          description: "Format portrait 2:3 (ex. 1000x1500px), affiché dans le panneau au survol de la liste des projets.",
          directory: "public/images/projects/hover",
          publicPath: "/images/projects/hover/",
        }),
        descriptionLongue: fields.document({
          label: "Description longue",
          description: "Décrit plus en détail ce que fait la solution, fonctionnellement.",
          formatting: true,
          images: {
            directory: "public/images/projects",
            publicPath: "/images/projects/",
          },
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        bg: fields.text({ label: "Couleur de fond (hex)" }),
        textColor: fields.text({ label: "Couleur du texte (hex)" }),
        year: fields.text({ label: "Année" }),
        problematique: fields.document({
          label: "Problématique",
          formatting: true,
          images: {
            directory: "public/images/projects",
            publicPath: "/images/projects/",
          },
        }),
        approche: fields.document({
          label: "Approche et solution",
          formatting: true,
          images: {
            directory: "public/images/projects",
            publicPath: "/images/projects/",
          },
        }),
        features: fields.array(
          fields.object({
            icon: fields.select({
              label: "Icône",
              options: [
                { label: "Éclair", value: "zap" },
                { label: "Couches", value: "layers" },
                { label: "Bouclier", value: "shield" },
                { label: "Fusée", value: "rocket" },
                { label: "Code", value: "code" },
                { label: "Utilisateurs", value: "users" },
              ],
              defaultValue: "zap",
            }),
            title: fields.text({ label: "Titre" }),
            description: fields.text({ label: "Description", multiline: true }),
          }),
          {
            label: "Fonctionnalités clés",
            itemLabel: (props) => props.fields.title.value,
          }
        ),
        screenshots: fields.array(
          fields.image({
            label: "Capture d'écran",
            directory: "public/images/projects/screenshots",
            publicPath: "/images/projects/screenshots/",
          }),
          {
            label: "Captures d'écran",
            description: "Affichées dans le carrousel de la page projet.",
            itemLabel: (props) => props.value?.filename ?? "Capture d'écran",
          }
        ),
        videos: fields.array(
          fields.file({
            label: "Vidéo",
            description: "Vidéo mp4 lue en boucle, sans son, dans le carrousel.",
            directory: "public/videos/projects",
            publicPath: "/videos/projects/",
          }),
          {
            label: "Vidéos de démo",
            description: "Affichées dans le carrousel de la page projet, avant les captures d'écran.",
            itemLabel: (props) => props.value?.filename ?? "Vidéo",
          }
        ),
        externalUrl: fields.text({
          label: "Lien externe (bouton \"Voir le projet\")",
          description: "Laisser vide pour masquer le bouton.",
        }),
      },
    }),
    playground: collection({
      label: "Playground",
      slugField: "title",
      path: "content/playground/*/",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Titre" } }),
        visible: fields.checkbox({
          label: "Visible",
          description: "Décoche pour masquer ce projet du site public.",
          defaultValue: true,
        }),
        ordre: fields.integer({
          label: "Ordre",
          description: "Détermine l'ordre d'affichage (croissant).",
          defaultValue: 100,
          validation: { isRequired: true },
        }),
        tools: fields.array(fields.text({ label: "Outil" }), {
          label: "Outils utilisés",
          itemLabel: (props) => props.value,
        }),
        description: fields.text({ label: "Description courte", multiline: true }),
        descriptionLongue: fields.document({
          label: "Description longue",
          formatting: true,
          images: {
            directory: "public/images/playground",
            publicPath: "/images/playground/",
          },
        }),
        image: fields.image({
          label: "Image",
          directory: "public/images/playground",
          publicPath: "/images/playground/",
        }),
        video: fields.file({
          label: "Vidéo (boucle)",
          description: "Vidéo mp4 diffusée en boucle dans le détail du projet. Laisser vide pour afficher l'image à la place.",
          directory: "public/videos/playground",
          publicPath: "/videos/playground/",
        }),
        screenshots: fields.array(
          fields.image({
            label: "Capture d'écran",
            directory: "public/images/playground/screenshots",
            publicPath: "/images/playground/screenshots/",
          }),
          {
            label: "Captures d'écran",
            description: "Affichées dans le carrousel du détail du projet.",
            itemLabel: (props) => props.value?.filename ?? "Capture d'écran",
          }
        ),
        githubUrl: fields.text({
          label: "Lien GitHub",
          description: "Laisser vide pour masquer le lien.",
        }),
        externalUrl: fields.text({
          label: "Lien externe (bouton \"Tester le projet\")",
          description: "Laisser vide pour masquer le bouton.",
        }),
        bg: fields.text({ label: "Couleur de fond (hex)" }),
      },
    }),
  },
});
