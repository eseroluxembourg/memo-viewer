# Modification des fresques

## Principes généraux

**Définition** : On appelle _fresque_ la vision sous forme d’un graphe où les différents nœuds sont les cartes et elles sont reliées par des flèches.

Les fresques sont représentées en interne par un fichier Json (voir [ici](/data/fresks/) pour la documentation). Mais comme il serait trop pénible de rentrer les coordonnées de chaque point à la main, il est possible et encouragé d'utiliser le CMS pour modifier les cartes.

**Fonctionnalités**
* Ajouter ou supprimer des cartes d'une Fresque (pour n'afficher que les cartes du lot 2 par exemple)
* Déplacer des cartes
* Importer les nœuds d'une Fresque vers une autre (utile pour créer rapidement une correction pour chaque lot)
* Associer chaque Fresque à un lot
* Associer chaque Fresque à une ou plusieurs variantes

**Ce qu’on ne peut pas faire**
* Supprimer ou ajouter une nouvelle Fresque ;
* Ajouter ou modifier des liens

## Usage avancé

### Modifier les styles des flèches

Le plugin vis-network nous offre de nombreux choix pour personnaliser les styles des flèches : couleur, ligne en pointillée, présences de flèches au début, à la fin ou aux deux endroits, style de flèche, etc. Tout ces paramètres sont définis [dans la documentation](https://visjs.github.io/vis-network/docs/network/edges.html).

Du côté du mémo, une grande partie de ces styles ont été implémentés dans la version 1.9.0 (plus pourraient l'être sur demande), les styles autorisés sont documentés dans le fichier `data-validation/schemas/linksStyle.json`.

Pour appliquer ces styles, il suffit de :
1. Ajouter des "classes" pour chaque lien (il peut y en avoir plusieurs) : une classe ne peut pas être constituée de caractères spéciaux (accents inclus) et peut contenir des chiffres, mais pas au début.
2. Définir les styles associés à chaque classe (dans le fichier `_links/linksStyle.json`)

Depuis la version 1.12, une légende est désormais affichée à partir du moment où certains styles sont utilisés. C'est pour cette raison qu'il est désormais nécessaire de définir des labels pour chaque classe, par exemple :
```
...
"my style": {
    "hidden": true,
    "color": "#0efaea",
    "arrows": "to from middle",
    "$label": {
        "fr-FR": "french",
        "en-GB": "in english"
    }
},
...
```

**Remarque** : chaque lien a également comme _classe cachée_ systématiquement son _statut_. C'est-à-dire qu'on peut changer le style de tous les liens _primaires_ en ajoutant la classe _primary_ dans `links/linksStyle.json`.

Ci-dessous les règles d'applications de style :
* un même lien peut avoir plusieurs classes, les classes sont alors appliquées de la première à la dernière. Dans le cas où une propriété est définie plusieurs fois, c'est donc la dernière class qui est prioritaire.

### Dessiner des formes

Il est possible d'ajouter n'importe quel élément en fond de la Fresque. Techniquement le plugin [vis-network](https://visjs.github.io/vis-network/docs/network/) utilise l'élément HTML5 canvas et offre la possiblité de créer une fonction appelée à chaque fois que vis-network touche à l'affichage. Le code pour dessiner sur le canvas est dans le fichier `FreskVisjsInterface.vue`.

En l'état, on peut dessiner des rectangles et des chemins svg.

#### Rectangles

Cette fonctionnalité a été développée pour la [Fresque des Frontières Planétaires](https://www.1erdegre.earth/fresque-des-frontieres-planetaires), on affiche des _zones colorées_ (rouge, jaune, vert, gris) qui indiquent à quel point les frontières ont été dépassées.


Dans le fichier `fresk_*.json`, il y a une section `background`, chaque élément est dessiné dans l'ordre. Ci-dessous la liste des éléments disponbles.
```json
[
    {
        "shape": "rectangle",
        "fillStyle": "#ffcb43",
        "x": 3,
        "y": -0.125,
        "width": 1,
        "height": 1.9
    }
]

```
**Note** : les coordonnées des nœuds ne correspondent pas aux coordonnées dans le canvas mais à une échelle (_tordue?_) adaptée aux dimensions d'une carte. Voir `cardSpaceX` et `cardSpaceY`.

Pour trouver les bonnes coordonnées, lancer le site en local et procéder par essais/erreurs.

Ajouter des nouvelles shape est réservé aux développeur·euses (voir section suivante).

##### Un SVG path

Cette fonctionnalité a été développée pour la [Fresque Océane](https://www.fresqueoceane.org/), elle permet de dessiner des formes quelconques en utilisant la syntaxe des chemins SVG.

Les coordonnées sont ici les coordonnées exactes du canvas. Pour trouver les bonnes coordonnées, il est conseillé de lancer le site en local et de procéder par essais et erreurs.

