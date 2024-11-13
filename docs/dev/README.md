# Développement

**Pré-requis** : le memo ne peut pas fonctionner tout seul, il a besoin d'un dossier de _données_, par ex. celui de la [Fresque du Climat](https://framagit.org/memo-fresques/fresque-du-climat).

Le mémo est un site internet statique qui fonctionne de la même manière que les "Static Site Generator" classiques : il suffit de créer des fichiers markdown dans les bons dossiers puis le mémo se charge tout seul de générer les différents fichiers de données.



* Pour disposer d'une version en local du site en mode Server Side Rendering (SSR) :
    ```
    npm run dev:app
    ```
    C'est la version la plus proche de ce qui est utilisé en production. S'il n'y a pas de problèmes avec cette version, c'est bon signe.

* Pour disposer d'une version en local du site en mode _classique_ :
    ```
    npm run vite
    ````
    Cette version n'utilise pas de SSR et s'évite tous les bugs associés mais est assez éloignée de la version de production. À utiliser avec précaution

* Pour pré-générer toutes les pages
    ```
    npm run generate
    ```
    Les différentes pages du site sont alors disponibles dans le dossier `dist/static`, dossier qui peut être directement téléversé sur le serveur.

* Déboguer le SSR et en particulier les `hydrations mismatches` (pour la partie _memo_, et non pas la partie _app_)
    * Compiler le client :
    ```
    npm run build:client
    ```
    * Compiler le serveur
    ```
    npm run build:server
    ```
    * Lancer le serveur
    ```
    npm run prod
    ```

## Les différents scripts

Ces scripts sont mutualisés entre les différentes Fresques qui peuvent ou non les utiliser.

### Intégrer les données d'une fresque

Le memo suppose que les différentes données nécessaires à son utilisation soient disponibles à des chemins précis. Pour cela, une possibilité est de créer des liens symboliques entre le dossier des données de la Fresque et le memo.<br/>
Le script `scripts/setup-data.sh` fait cela à condition que le repo _fresque_ soit correctement architecturée.

### Manipuler les cartes

`scripts/cardmanipulations.py` est un ensemble de fonctions Python pour réaliser des opérations courantes sur les pdf des cartes :
* Extraire les différentes cartes d’un pdf ;
* Convertir chaque page dans un format vectoriel compressé ;
* Créer des vignettes de différentes tailles pour chaque page ;
* Tenter de deviner le titre d'une carte (extrait tous les textes, regarde les longueurs des textes et la taille de la police)

### Les plugins Vite

Fichiers `vite/vite-plugin-*.js` : ces scripts permettent de générer les fichiers `data/*.json` à partir des différents fichiers markdown. Par ex. `vite/vite-plugin-cards.json` parcourt les différentes cartes (fichiers `_cards/*/*.md`) et créée un fichier json `cards.json` qui liste toutes les cartes disponibles et indique pour chacune d'entre elle les langues pour laquelle cette carte est disponible.


## Langues

**Fonctionnement des traductions** : Le mémo est multi-langue mais permet néanmoins de travailler avec des traductions incomplètes.

* Si la données existe dans la langue souhaitée par l’utilisateur·ice, on l’affiche.
* Sinon, et qu’elle existe dans la langue anglaise (code `en-GB`), on affiche celle-là
* sinon, on affiche la données dans une langue où celle-ci est disponible.

Ce qui veut entre autres dire :
1. **Critique que la donnée soit toujours disponible dans au moins une langue**
2. S’il y a une seule langue à définir, c’est l’anglais.

Les langues proposées dans le mémo correspondent aux langues dans lesquelles les cartes (en image) sont disponibles. En effet, l’affichage d’une langue suppose **toujours** que la carte est disponible dans cette langue.

Pour ne pas faire crasher l'application, il faut que les langues définies disposent de fichiers de traductions (voir `i18n/common/*.json`)

## Troubleshooting

### error when starting dev server: YAMLException: can not read a block mapping entry;

The card file has probably non-escaped `"` in "backDescription". You should escape all of them (`"` --> `\"`).

The regex below will help you
```
:.*[^( :)|\\]"[^\n]
```