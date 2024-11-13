# Les Fresques

> Pour en savoir plus sur comment éditer les Fresques avec l’outil inter : [lien vers la doc](/admin/fresks)

Il doit exister une Fresque par lot de cartes et chaque variante doit avoir une Fresque. Chaque Fresque est construite à partir d’un fichier `.json` enregistré au sein du dossier `_fresks`.


## Format de données

**Schéma** : `data-validation/schemas/fresk.json`

**Changelog** :
* v1.7.0 : ajout des champs `lots` et `variants`

```json
{
    "version": "1.0.0", // Numéro de la version courante du memo-viewer. Cela permet de migrer le fichier si jamais le format évolue.
    "lot": "", // Numéro du lot
    "variants": [], // Liste de variantes (chaînes de caractères)
    "title": {
        "fr-FR": "Lots 1 à 5" // Titre de la fresque dans toutes les langues. Mettre au moins une langue.
    },
    // Liste de toutes les cartes à afficher avec leurs coordonnées.
    "nodes": [
        {
            "cardId": "<identifiant de la carte>",
            "xPos": -0.5, // Position en x, un nombre
            "yPos": 1, // Position en y, un nombre.
            "zoom": 1.6 // Taille de la carte. 1 = par défaut. > 1 = plus grand que les autres cartes. < 1 = plus petit
        },

    ],
    // Liste des liens inter-cartes **supplémentaires**. À cette liste sont ajoutées automatiquement **tous les liens** _valides_entre les cartes
    "edges": [
        {
            "from": "18", // Identifiant de l acarte
            "to": "22", // Identifiant de la carte
            "status": "invalid" // Valeurs possibles : valid, invalid, optional, temporary
        }
    ],
    // Liste de tous les éléments de background à afficher
    "background" : [
        {
            "shape": "rectangle", // uniquement rectangle
            "fillStyle": "#ffcb43", // un truc valide pour ctx.fillStyle =
            "x": 3, // Ccoordonnée du centre du rect
            "y": -0.125, // coordonnée du centre du rect
            "width": 1, // largeur
            "height": 1.9 // hauteur
        }

    ]
}
```

