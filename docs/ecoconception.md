# Un pas vers l'éco-conception

Le mémo est une occasion pour s'interroger sur les pratiques d'éco-conception web. Certaines pratiques comme l'optimisation des images ou le fait d'utiliser un site statique sont présentes depuis le début du projet. Mais ceci est grandement incomplet pour considérer que le mémo soit éco-conçu. Cette page a donc vocation à s'agrandir au fil du temps.

## Usage raisonné des images

Fiches du Référentiel éco-conception correspondantes : [Optimiser les images](https://github.com/cnumr/best-practices/blob/main/chapters/BP_080_fr.md), [Optimiser les images vectorielles](https://github.com/cnumr/best-practices/blob/main/chapters/BP_036_fr.md), [Éviter d’utiliser des images matricielles pour l’interface](https://github.com/cnumr/best-practices/blob/main/chapters/BP_035_fr.md).

Le mémo affiche beaucoup de fois les images des cartes du jeu. À raison d'une quarantaine de cartes différentes recto et verso, il est crucial de faire attention aux poids des différentes images pour limiter le poids de la page et en limiter son impact.

Différentes pratiques ont été mises en place.

### Préférer les icônes vectorielles

Préférer au maximum les icônes vectorielles ou CSS plutôt que les images\
👉 Les différentes (point d'interrogation, cartes) sont des images vectorielles compressées avec [scour](https://github.com/scour-project/scour) de l'ordre de 1kB par image.


### Compresser au maximum les représentation vectorielles des cartes

Sur les vues cartes, pour des raisons d'expérience utilisateur c'est une représentation vectorielle de la carte et non pas une image qui est affichée. Ceci permet notamment de pouvoir sélectionner le texte. Les photos ne sont pas directement vectorisées mais intégrées sous forme matricielle (base64) aux images.

👉 Ce fichier svg est calculé à partir des fichiers pdfs fournis par les fresques mais est grandement compressé : les images sont redimensionnées à la taille de la carte puis compressées avec [jpegoptim](https://github.com/tjko/jpegoptim) ou [pngquant](https://pngquant.org/). Dès que cela est possible (il n'y a pas de transparence) et si c'est moins lourd, l'image est convertie en jpeg. Il est également possible de remplacer des éléments matriciels (par exemple le logo) par sa version vectorisée.

Pour la Fresque des Frontières planétaires on passe d’un pdf d'entrée de 45 Mo à 2.9 Mo pour l'intégralité des vectorielles.

### Compression des différentes images

Une même image de carte est proposée en plusieurs formats différents adaptées aux différents usages :
* webp avec quatre résolutions 125px, 250px, 450px et 600px
* toutes les images versos sont des png (car on considère qu'il n'y a pas de photos) tandis que les rectos sont des jpeg
* toutes les images jpeg et png sont compressées.

### Téléchargement des images à la volée

Depuis la version 1.6.4, toutes les images ne sont plus automatiquement téléchargées lorsqu'on ouvre la vue "liste" des cartes. Elles sont téléchargées uniquement au moment où l'image commence à apparaître à l'écran.


### Aller encore plus loin

**Pour aller plus loin** : ne serait-il pas possible de ne pas afficher autant d'images ? Sont-elles toutes nécesasires ?

## Site internet statique
