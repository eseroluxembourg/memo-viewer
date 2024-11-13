# Gérer les traductions avec Tolgee

?> Cette page s'adresse à des développeur·euses

Il est possible de gérer les traductions des cartes en dehors du Mémo. Cela peut être très utile si vous avez plusieurs projets à traduire, vous pouvez ainsi centraliser tous vos projets en un unique endroit.
Pour autant, **le mémo ne nécessite pas d'avoir Tolgee pour fonctionner**, vous pouvez gérer les traductions directement dans l'interface d'administration.


## Mise en place

### Créer le projet Tolgee

Il est recommandé de créer un projet Tolgee dédié au mémo, et de générer un token avec les droits de lecture et d'écriture au projet. Sauvegardez ce token.

### Installer les dépendances

* TolGitBot : il s'agit d'un petit utilitaire pour gérer les traductions avec Tolgee
```terminal
npm install git+https://framagit.org/Marc-AntoineA/tolgitbot.git
```

### Créer des nouveaux scripts

Définir dans le fichier `package.json` les commandes `tolgit:pull` et `tolgit:push`.

```
{
    ...
    "scripts": {
        "tolgit:install": "npm run install",
        "tolgit:pull": "node node_modules/tolgitbot/cli.mjs pull -i memo-viewer/.tolgee/tolgitdatainterface.js",
        "tolgit:push": "node node_modules/tolgitbot/cli.mjs push -i memo-viewer/.tolgee/tolgitdatainterface.js"
    },
    ...
}
```

Ces commandes vont appeler l'utilitaire `tolgitbot` en lui donnant comme argument un script présent dans `memo-viewer` et spécialement conçu pour extraire les différentes chaînes de caractères à traduire du projet.

Pour récupérer les traductions depuis Tolgee, exécuter : `npm run tolgit:pull`.
Pour envoyer les traductions vers Tolgee, exécuter `npm run tolgit:push`

Pour fonctionner ces commandes ont besoin que vous exportiez dans des variables d'environnement les trois éléments suivants :
* `TOLGEE_URL` : l'url vers votre instance Tolgee ;
* `TOLGEE_PROJECT_ID` : l'identifiant du projet Tolgee ;
* `TOLGEE_TOKEN` : le token pour vous authentifier.

Pour exécuter le script en local sur votre ordinateur, vous pouvez utiliser la syntaxe `EXPORT MAVARIABLE=xxx`.

### Mettre en place une intégration continue

Il est conseillé de paramétrer votre instance pour que les traductions soient synchronisées automatiquement entre Tolgee et votre projet.