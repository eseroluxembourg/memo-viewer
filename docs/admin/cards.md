# Images des cartes

Pour ne pas alourdir le dossier de données Gitlab, les images des cartes en sont exclues et n'y apparaissent donc pas.

Les cibles de l'intégration continue `generate-app` et `deploy-app` ignorent totalement les images.

La génération des images est réalisée par une _moulinette_ interne dédiée qui prend en entrée les différents fichiers pdf et génère les cartes dans les différents formats utiles pour le mémo : svg, png, jpeg, webp.

> Il est prévu que ce script puisse être directement appelé depuis l'intégration continue de Gitlab à travers la target `generate-cards` (voir ticket [#148](https://framagit.org/memo-fresques/memo-viewer/-/issues/148)).


## Fonctionnement de base

**Objectif** : L'objectif général est simple : construire toutes les images des cartes à partir d'un unique fichier pdf par langue.

La **contrainte** est de faire cela sans toucher au fichier pdf d'origine (il ne faut pas ajouter du travail à la structure qui porte la Fresque).

Pour y arriver, il faut indiquer à l'ordinateur où se situent les différentes cartes dans le fichier pdf : les cartes peuvent ne pas être dans le bon ordre dans le pdf, ou bien d'autres cartes sont intercalées (correction, présentation du jeu, etc.) ou bien certaines pages contiennent plusieurs cartes différentes.<br/>
👉 Il n’y a pas de magie : l'ordinateur est totalement incapable de savoir tout seul où sont les différentes pages.

Pour fonctionner, il faut créer plusieurs fichiers `json` :
* Un fichier `variants.json` à la racine du projet qui permet d'indiquer au script où récupérer les fichiers pdfs et de les télécharger si nécessaire ;
* Un (ou plusieurs) fichier(s) `pdfformat.json`, dans  qui permet d'indiquer la manière de récupérer les images des cartes à partir du pdf et en particulier la correspondance : page du pdf / numéro de carte (dans un dossier `moulinette-data`)
* Un ou plusieurs fichiers `replacements.json` pour améliorer la vectorisation (dans un dossier `moulinette-data`)


Une fois ces différents fichiers créés, se placer à la racine de son projet et exécuter :
```terminal
python3 memo-viewer/moulinette/moulinette.py
```
Les différentes options possibles :
* `--force` pour générer des cartes qui ont déjà été générées à partir d'un pdf
* `--lang` et `--variant` pour ne générer qu’une variante ou qu’une langue spécifiquement (on peut combiner les deux)

### Fichier `variants.json`

En plus de lister les variantes disponibles, ce fichier permet de définir pour chaque variante et chaque langue : où trouver le pdf et comment le lire. Le contenu de ce fichier peut être modifié directement dans le CMS.

* Chaque url doit être différente.
* Si le pdf n'est pas disponible en ligne, laisser le champ url vide et copier le pdf à la main dans le dossier `moulinette-data/_pdfs` avec comme nom `<lang>_<variant>.pdf`, par ex. `fr-FR_v9.0.pdf`


**Voir le schéma** dans `data-validations/variants/variants.json`.

**Remarque** : la structure de ce fichier peut être validée en exécutant `npm run test`.


Exemple.
```json
{
    "v8.4": {
        "default": false,
        "deprecated": true,
        "langs": {
            "fr-FR": {
                "url": "https://drive.google.com/file/d/15DJkpE4gXnNvr5OV8YPgMwOkkshwgaf0/view",
                "format": "pdfformat-v8.4.json",
                "replacements": "replacements-v8.4.json"
            },
            "en-GB": {
                "url": "https://drive.google.com/file/d/15cCI0tYYgsRdKI0EJAd2KSdTj_-WWZMi/view",
            }
        }
    }
}
```


### Fichier `pdfformat.json`

> Il est désormais possible de modifier ce fichier directement dans l'interface d'administration du mémo. Pour accéder à cette page, il faut avoir créé le fichier et l’avoir push sur git. Ensuite se rendre sur la page `/admin/#/fr-FR/pdfformat/pdfformat-v2.1.json` (en adaptant au nom de son fichier). On peut alors charger le pdf et visualiser en temps réel à quelle page correspond chaque carte.

Ce fichier est créé une seule fois et peut ensuite être réutilisé pour toutes les langues du jeu ou lorsque les images du jeu évoluent, **à condition que la structure du pdf soit constante** (c'est-à-dire que la carte 3 est toujours sur la même page).

Pour chaque image de carte, on indique :
* sur quelle page du pdf la trouver
* l'identifiant de la carte concernée
* quelle partie de la carte est-ce ? (le recto ou le verso)

Ensuite, il est possible d'indiquer d'autres options :
* quelle est l'orientation de l'image sur la page ? Parfois, notamment lorsqu'une même page pdf comprend plusieurs cartes, il est possible que des images soient à l'envers. Orientation : `north`, `south`, `east`, `west`
* la zone de la page où est présente l'image, ceci afin de supprimer les hirondelles/traits de coupe. Valeurs `x`, `y`, `width` et `height`. Ces valeurs doivent être renseignées en `pt` et peuvent être calculées en utilisant `Inkscape`.

**Exemple de fichier** :

La manière de transmettre la structure du fichier pdf à l'ordinateur est de créer un fichier `json` au format suivant :
```json
[
     {
        "pdfpage": 5,
        "cardid": "31",
        "side": "front"
    },
    {
        "pdfpage": 100,
        "cardid": "60",
        "side": "back",
        "options": {
            "crop": {
                "x": 197    ,
                "y": 0,
                "width": 197,
                "height": 266
            }
        }
    },
    {
        "pdfpage": 100,
        "cardid": "63",
        "side": "back",
        "options": {
            "orientation": "south",
            "crop": {
                "x": 0,
                "y": 0,
                "width": 197,
                "height": 266
            }
        }
    }
]
```
_Le schéma exact est disponible dans le dossier `moulinette/schema` du projet._<br/>
👆 Dans l'exemple ci-dessus on indique :
* qu'il y a trois cartes dans le fichier pdf, les cartes d'identifiants : "31", "60" et "63".
* que le verso ("front") de la carte d'identifiant "5" est situé page 5
* que le recto ("back") de la carte d'identifiant "60" est situé page 100 du pdf mais uniquement sur la partie droite de la page ;
* que le recto ("back") de la carte d'identifiant "63" est situé sur la page 100 du pdf, partie gauche. Et qu'il faut ensuite tourner cette page (`"orientation": "south"`)

**Notes** : les notions d'orientation ou de rognage correspondent à des usages avancés. Pour l'orientation, ce n'est pas très clair quelle valeur mettre (faire des essais ?).

Une fois ce fichier créé, il est possible d'exécuter le script avec les bons arguments :
```terminal
python3 memo-viewer/scripts/generatecardsfrompdf.py --lang fr-FR --pdf monfichier.pdf --config maconfig.json
```
Les cartes vont ensuite être généres dans un dossier `cards/fr-FR`.

### Fichiers `replacement.json`

De base, la moulinette va chercher à compresser les cartes en compressant chaque image indépendemment mais est incapable de vectoriser elle même les images.

Par conséquent, il est fréquent que des logos soient présents dans un format matriciel bien trop lourd.

Une technique est dans ce cas de vectoriser à la main les différentes images et de demander à la moulinette de remplacer la version _matricielle_ par la version _vectorielle_.

Pour indiquer à la moulinette quelles images remplacer, il faut créer un fichier csv avec `;` commme séparateur :

```csv
fromimage;toimage;similarity
./scripts/assets/logo.png;./scripts/assets/logo.svg;0.5
```
Il est important que (1) le chemin complet vers les fichiers soit renseigné; que (2) la première image soit un png et la deuxième un svg. La similarité doit être un nombre entre 0 et 1, 1 pour dire "ne remplacer que les images extrêment similaires à l’image cible."

## Publier les cartes sur le serveur

Pour publier les cartes sur le serveur, il est possible d'utiliser directement le playbook ansible `deploy-cards.yml` qui synchronise via ssh (en utilisant `rsync`) puis s'assure que les permissions sont correctes.

Pour l'exécuter :
```terminal
npm run ansible:deploycards
```

## Documentation avancée

Cette section regroupe un ensemble de ressources et de problèmes qui ont déjà été rencontrés en manipulant les pdf des cartes de certaines Fresques, dans l'objectif d'aider à résoudre des besoins similaires


### Environnement de développement

Pour pouvoir appeler le script depuis son ordinateur, il est nécessaire de disposer des éléments suivants.

* Python3
* Module `images_manipulator` : pour le moment à installer en clonant le repo https://framagit.org/Marc-AntoineA/files-manipulator puis en faisant un `pip install images-manipulator`
* Installation de certaines dépendances internes de `images-manipulator` : identify, pngquant, inkscape, potrace, magick, etc.


### Difficultés rencontrées

_La conversion des cartes d'un pdf vers un svg n'est malheureusement pas du tout une étape facile à faire :/_

#### La conversion pdf --> svg échoue

Tenter d'ouvrir le fichier pdf avec Inkscape en mode _garder les fonts_ pour identifier si le bug vient de Inkscape ou des différentes manipulations effectuées dans la moulinette.

#### Texte qui n'apparaît pas

Pour la v9.0 de la Fresque du Climat, la font choisie était de type "fonttype3" qui n'est pas supportée par Inkscape. La solution choisie a été de regénérer les cartes en utilisant la même font mais convertie avec un fonttype usuel. Cela a été réalisé grâce à convertio.co : conversion de la font en svg puis de svg à ttf.

### Découpage d'un pdf en plusieurs pages

* Option `pdfseparate` : ça marche extrêmement bien et c'est désormais ce qui est utilisé au sein du mémo (_cf_ `script/utils/cardsmanipulation.py`)
```terminal
pdfseparate fichier_a_separer.pdf %d.pdf
```
* Option `qpdf`
```terminal
qpdf --split-pages fichier_a_separer.pdf %d-out.pdf
```
* Option `pdftk` : nécessite de connaître le nombre de pages à l’avance
```terminal
for k in {1..31}; do
pdftk fichier_a_separer.pdf cat "$(expr $k + $k)" output back-$k.pdf;
done
```

### Découper une page pdf en plusieurs morceaux

**Cas d'usages** :
* une même page pdf contient deux cartes côte à côte, à traiter comme deux images séparées au niveau du mémo ;
* la page de la carte dispose de marges pour l'impression, à découper

Ressource utilisée : ["How can I split a PDF's pages down the middle?"](https://superuser.com/questions/235074/how-can-i-split-a-pdfs-pages-down-the-middle) (Stack Overflow)

L'idée ici est d'exporter la page en utilisant GhostScript en spécifiant _la fenêtre_ qu'on souhaite extraire. Pour cela, il faut :

* connaître les dimensions de la page en `pt` : on peut utiliser `pdfinfo` sur Linux (_cf_ schéma ci-dessous)
* spécifier la hauteur et la largeur à extraire **en pixels** (c'est à dire **10x** la dimension en `pt`)
* spécifier l'origine (le coin en haut à gauche à extraire) sous la forme d'un _décalage_ (ou _offset_), cette fois **en `pt`**.

Ainsi dans le cas du schéma ci-dessous, nous effectuons les commandes :
```terminal
# page gauche
gs -o output.pdf -f input.pdf -sDEVICE=pdfwrite -g1970x2660 -c "<</PageOffset [0 0]>> setpagedevice"
# page droite
gs -o output.pdf -f input.pdf -sDEVICE=pdfwrite -g1970x2660 -c "<</PageOffset [-197 0]>> setpagedevice"
```

[filename](assets/splitpdf.drawio ':include :type=code')


### Tourner un pdf

Pour tourner une unique page d'un pdf on peut utiliser `pdftk`

```terminal
pdftk mapage.pdf cat 1west output output.pdf
```
où `1west` correspond à la concaténation entre `1` (pour dire _la page 1_) et l'orientation `west`, qui peut être remplacée par `east`, `north`, `south` ou `west`.
