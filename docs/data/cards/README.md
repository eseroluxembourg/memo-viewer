# Les cartes


**Chemins** : `src/assets/_cards/<cardid>/<lang>/index.md`

Les données sont enregistrées au sein de fichiers markdown :
* un fichier `index.md` à la racine du dossier `src/assets/_cards/<cardId>` ;
* un fichier `index.md` par langue dans laquelle la carte est traduite, aux chemins `src/assets/_cards/<cardid>/lang/index.md`

Chaque carte est référencée par un identifiant unique _cardId_ qui est utilisée dans le nom du dossier où son stockés les fichiers.
En pratique, l'identifiant est identique au numéro de carte mais peut être différent dans le cas où il y a plusieurs versions d’un même jeu (version junior, version adulte).

**Changelog** :
* v1.7.0 : passage à deux types de fichiers `index.md` et `<i18n>/index.md` au lieu d'un unique type `<i18n>/index.md`. Ajout du champ `variants`

## Fichier par carte

_Voir le schéma `data-validation/schemas/card.json`_

L'objectif de ce fichier est  de contenir toutes les informations qui ne sont pas dépendantes de l langue

**Exemple** :

```md
---
lot: <Numéro de lot>
num: <Numéro de la carte>
isFrontOnly: <true|false>
variants:
    - <variante1>
    - <variante2>
---
```

### Numéro/Nom de lot

Paramètre **obligatoire**, peut-être une une chaîne de caractère (pas forcément un numéro). Par ex. « A » ou « Causes »

### Numéro de la carte

Paramètre **obligatoire**. Peut-être une lettre ou une chaîne de caractère quelquconque. Par ex. `A`, `S1`, ..., `S15`.

Le numéro de la carte apparaît en gros sur la carte dans les affichages _listes_ ou _grilles_. Il sert également à trier les cartes :
* on met en premier les cartes qui sont des numéros, en les triant du plus petit au plus grand ;
* on trie ensuite par lettre de l’alphabet
* puis si la lettre est suivi d’un nombre, on trie par le nombre.

En l’occurence, on pourrait avoir le tri suivant : 1, 2, 3, …, 30, S1, …, S23.

### Carte recto uniquement
Paramètre **optionnel** . Si `true`, cela signifie que la carte n’a pas de verso.

## Fichiers par carte et par langue

**Exemple** :

```md
---
title: <Titre de la carte>
backDescription: <Texte présent à l’arrière de la carte>
wikiUrl: <Lien complet vers le wiki>
youtubeCode: <Lien vers une éventuelle vidéo youtube>
instagramCode: <Lien vers un post Instagram>
---
Texte de présentation de la carte avec des explications complémentaires.
```

### Contenu


Ce texte est du pur markdown donc peut contenir **du gras** , _de l'italique_,

*  des listes
* à puces

1. Ou encore
2. numérotées

Des images aussi, des [urls](https://...fr), etc.

Voir la page [dédiée au Markdown](/admin/markdown) dans cette documentation.

### Titre

Paramètre **obligatoire**


### Lien vers le wiki

_Paramètre facultatif_

Il s’agit d’une url complète vers une page en wiki (ou autre) qui permet d’avoir plus d’informations sur la carte.
Sur le mémo, cela appararaît sous la forme d'un petit icône _Wiki_ sous la carte.


### Lien vers Instagram

_Paramètre facultatif_

### Lien vers Youtube

_Paramètre facultatif_
