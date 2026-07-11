import { config, collection, fields } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    projects: collection({
      label: "Projets",
      slugField: "slug",
      path: "content/projects/*",
      format: { data: "json" },
      schema: {
        slug: fields.slug({ name: { label: "Slug" } }),
        name: fields.text({ label: "Nom court" }),
        longName: fields.text({ label: "Nom long" }),
        description: fields.text({ label: "Description", multiline: true }),
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
        screenshotsCount: fields.integer({
          label: "Nombre de captures d'écran",
          defaultValue: 1,
          validation: { isRequired: true, min: 1, max: 3 },
        }),
        externalUrl: fields.text({
          label: "Lien externe (bouton \"Voir le projet\")",
          description: "Laisser vide pour masquer le bouton.",
        }),
      },
    }),
    playground: collection({
      label: "Playground",
      slugField: "title",
      path: "content/playground/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Titre" } }),
        tool: fields.text({ label: "Outil" }),
        description: fields.text({ label: "Description", multiline: true }),
        bg: fields.text({ label: "Couleur de fond (hex)" }),
      },
    }),
  },
});
