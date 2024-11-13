# Créer son mémo depuis zéro

La mise en place d'un nouveau mémo nécessite quelques heures de travail et des connaissances basiques de développement informatique.

Cette fiche n'est pas totalement exhaustive, il n'y a, à l'heure actuelle (novembre 2023) pas encore eu assez de mises en place de Fresque pour s’assurer qu'aucune étape n'a été oubliée.

## Pré-requis

Pour réaliser les étapes suivantes, il y a besoin de `git` (pour récupérer le code source du mémo), de `npm` pour la gestion des dépendances et de `python3` pour les différents scripts de manipulation des cartes.


## 1️⃣ Mise en place initiale

### Structure générale

Pour fonctionner, le mémo enregistre toutes les données dans des dossiers et des fichiers. Il est indispensable que ces données soient correctement structurées. Pour cela, il existe un générateur [yeoman](https://yeoman.io) qui permet d'initialiser son propre mémo. Il est recommandé de s’en servir.

Ces fichiers peuvent ensuite être sauvegardées en utilisant git.

1. Créer le dossier qui contiendra les données de votre Fresque et s’y rendre :
```terminal
mkdir <ma-super-fresque>
cd <ma-super-fresque>
```

2. Récupérer le code source du Mémo (et du générateur) :
```terminal
git clone https://framagit.org/memo-fresques/memo-viewer.git
```
Il est important que le code source soit dans un sous-dossier de votre fresque et qu’il soit nommé **memo-viewer**.

?> Il est possible d'utiliser un lien symbolique plutôt que de mettre le code de `memo-viewer`

3. Installer le générateur :
    * Installer Yeoman
```terminal
npm install -g yo
```
    * Installer le générateur et ses dépendances
```terminal
cd memo-viewer/generator-memo
npm install
npm link
```
3. Vous déplacer **à l'endroit dans le dossier qui contiendra votre Fresque (dossier `<ma super-fresque>`) et y créer les fichiers :
```terminal
cd ../..
yo memo
```

**🎉 Ça y est, vous avez tous les fichiers nécessaires pour faire tourner le mémo, il ne vous reste plus qu’à compléter avec vos données.**
Voir plus bas comment compléter.


## 2️⃣ Lancer en local

### Pré-requis - installer le mémo

Vous avez besoin de disposer sur votre ordinateur du dossier de votre fresque et que ce dossier contienne un sous-dossier nommé `memo-viewer` qui contient le code source du mémo.
**Solution 1** : vous pouvez directement cloner le code dans le dossier de votre Fresque (c'est ce qui a été fait dans la _Mise en place initial_)
**Solution 2** : vous pouvez cloner le mémo ailleurs sur votre ordinateur et créer un lien symbolique − il s’agit de la solution recommandée si et seulement vous travaillez sur plusieurs fresques à la fois.
```terminal
ln -s <path to memo-viewer> <path-to-your-fresk>/memo-viewer
```

### Lancer le mémo

Les commandes suivantes sont à exécuter dans le dossier de votre Fresque :
* Installer les dépendances
```terminal
npm install
npm run install:app
```

* Lancer le mémo
```terminal
npm run dev:app
```
### Lancer l'interface d'administration

Les commandes suivantes sont à exécuter dans le dossier de votre Fresque

* Installer les dépendances
```terminal
npm run install:admin
```

* Exécuter le mémo :
```terminal
npm run dev:admin
```

## 3️⃣ Sauvegarder sous Git

Il est recommandé d'utiliser Git pour versionner les modifications réalisées dans vos donnés et il est recommandé d’utiliser une instance Gitlab pour profiter des scripts de déploiement (`.gitlab-ci.yml`) déjà existants.

Dans l'idéal, le projet est ajouté au groupe Framagit [Memo-Fresques](https://framagit.org/memo-fresques/), ce qui permet aux développeur·euses de s'assurer que leurs nouvelles fonctionnalités sont toujours compatibles avec votre mémo.

?> Vous souhaitez que votre mémo soit automatiquement mis à jour à chaque nouvelle fonctionnalité ? Contacter les développeur·euses du mémo pour que votre mémo apparaisse dans la liste.

Configuration de votre projet git :
* la visiblité du projet git peut-être **public** ou **privé**. Il est recommandé de rendre le projet public à partir du moment où le mémo en lui même est accessible sans mot de passe. Sinon de le mettre en privé par cohérence ;
* pour fonctionner l'interface d'administration a besoin de savoir comment accéder au projet, pour cela, mettre à jour les entrées relatives à Gitlab dans `settings.json`
```json
"gitlab": {
    "base_url": "https://framagit.org/",
    "repo": "memo-fresques/fresque-du-climat",
    "branch": "main",
    "project_id": 1
},
```
* Le fonctionnement recommandé (février 2024) est que toutes les modifications soient directement faites sur la branche principale, il est donc nécessaire de maintenir la branche princpale comme *protected* mais sur laquelle les *développeur·euses* peuvent commiter directement.
* On peut utiliser les « Intégrations Gitlab » pour être notifié·e par email à chaque commit ou bien à chaque échec dans l'intégration continue. Cela peut être utile pour garder une trace des modifications réalisées par les contributeurices et pouvoir les modérer _a posteriori_.

## 4️⃣ Ajouter les premières données

### ➡️ Configuration générale

* Mettre à jour le fichier `settings.json` avec le nom de l'instance ou de contact.
* Ajouter le logo de l'instance (**en png**) avec comme nom la langue dans le dossier `images/logo/logo` (par ex. `images/logo/logo/fr-FR.png`)
* Ajouter le favicon de l'instance avec comme nom `favicon.ico` à la racine de `images/logo`
* Ajouter l'image d'illustration du mémo, utilisée pour la page *À propos* et l'illustration Open Graph (**en png**) à la racine de images/previews/` (par ex. `images/previews/fr-FR.png`)
* Modifier le fichier `assets/styles/local.scss` pour appliquer un style particulier au mémo et notamment indiquer les couleurs primaires et secondaires, ainsi que l'éventuel usage d'une police de caractères particulière (font dont les fichiers `.ttf` doivent être sauvegardés dans le dossier `assets/fonts`)
* Créer ou modifier le fichier vectoriel existant `images/icons/card-number-icon.svg` qui apparaît en surcouche des cartes sur le mémo. *A minima* changer sa couleur pour refléter votre Fresque peut être une bonne idée ;
* Modifier éventuellement l'image `images/unknown-card.png`. Cette carte est utilisée dans le *mode quiz*

### ➡️ Page *« À propos »*

Créer un fichier par langue à la racine de `_pages/about` (par ex. `_pages/about/fr-FR.md`) :
```md
---
title:  "À propos de la Fresque Océane"
---

La description de votre Fresque
```

Ce texte est affiché sur la page « À propos du Mémo », avant un paragraphe général sur le mémo.

### ➡️ Ajouter les polices de caractères

Pour que l'affichage des cartes soit correct, il est important de charger les polices de caractères présentes sur les cartes.

👉 Voir la [page dédiée](/deploy/fonts) de la documentation pour en savoir plus.


### ➡️ Ajout des cartes

Afin de pouvoir lancer le mémo, le plus important est d'ajouter les images des cartes. Pour cela, il est recommandé de partir d’un fichier pdf qui contient toutes les cartes (recto et verso) pour une seule langue, au format 1 carte par page.

👉 Voir la [page dédiée](/admin/cards) de la documentation pour en savoir plus.

#### Création des fichiers markdown

?> Ancien script, toujours d'actualité ?

Ça y est, les images des cartes sont disponibles dans le dossier `cards`, mais il manque encore les fichiers Markdown, utiliser le script `memo-viewer/scripts/createcardsfromsvg.py` pour créer les différents fichiers markdown et les pré-remplir à partir des données lues dans les cartes : le script essaie de deviner le titre, le texte à l’arrière de la carte et le numéro de lot.

(**todo: donner quelques billes sur comment on sait que c’est un titre**)

Pour que l’affichage soit correct, il faut ajouter les polices de caractères utilisées sur les cartes au mémo, voir [polices de caractères][/deploy/fonts]

**À bonnifier et compléter**


