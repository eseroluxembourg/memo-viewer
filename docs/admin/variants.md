# Les variantes

## Définition et fonctionnement

### Le problème
Un même jeu de Fresque évolue : certaines cartes sont ajoutées, d’autres supprimées, les textes ou les images d’illustration évoluent. Il existe aussi des variantes simplifiées ou _expertes_ du jeu.La notion de _variantes_ a pour objectif de rendre disponible ces différents cas d'usage dans le mémo.

On souhaite pouvoir :
* rediriger l'utilisateur·ice vers la dernière version ;
* informer l'utilisateur·ice qu'iel regarde une version obsolète ;
* simplifier les sorties de nouvelles versions (ne pas devoir tout recommencer) ;
* permettre de mutualiser les explications entre les cartes de plusieurs variantes (les explications de la carte 35 sont les mêmes en version 7.5 et 8.4)
* gérer des traductions partielles de variantes : certaines variantes sont traduites dans toutes les langues tandis que d’autres ne le sont qu’en certaines langues ;


### Une solution naïve : tout dupliquer

Une solution aurait été de dupliquer toutes les cartes à chaque nouvelle sortie de version en créant des cartes `35_v9.0` à la sortie de la version `v9.0`.

Cette solution est relativement facile à mettre en place mais elle fait perdre l'information qu'une même garde reste entre différentes variantes. Cela signifie en particulier que si l'explication de la carte 35 en _v9.0_ évolue, il faut également la faire évoluer dans toutes les autres versions (_v8.4_ notamment).

### La solution des variantes

Le mécanisme implémenté au niveau du mémo est un peu plus complexe :
* pour chaque carte, on liste toutes les variantes dans laquelle elle apparaît ;
* pour chaque variante, on renseigne s'il s'agit de la version par défaut (la dernière publiée), si elle est obsolète et toutes les langues dans laquelle elle est actuellement traduite ;
* suivant la langue sélectionnée, l'utilisateurice peut choisir d’afficher une des variantes disponibles dans cette langue ;
* les images affichées dans le mémo correspondent aux images dans la variante demandée par l'utilisateurie.

## Mise en place par l'exemple

### 1/ Créer les fichiers de lecture d'un pdf : `pdfformat` et `pdfreplacements`

Voir [admin/cards]

### 2/ Ajouter une nouvelle variante dans le fichier `variants.json`

On ne peut pas ajouter une variante dans le CMS, il faut donc l'ajouter à la main

### 3/ Indiquer pour chaque carte et fresque si elle appartient à cette variante

Cela se fait dans le CMS en cliquant ou non sur les versions

### 4/ Créer les éventuelles cartes et liens supplémentaires

Pour le moment, la création de cartes n'est pas possible dans le CMS, il faut donc créer les fichiers markdown à la main. Les liens peuvent être créés dans le CMS.

Par exemple, dans la Fresque du climat entre les versions 8.4 et 9.0 la carte 42 a été remplacée :
* création d'une nouvelle carte d'identifiant `42_v9`, de numéro `42`
* pour toutes les cartes différentes de 42 sur la v8.4, indiquer que ces cartes restent valides en v9
* indique que la carte `42_v9` est valide sur la v9.

### 5/ Créer les éventuelles nouvelles Fresques

Chaque lot de chaque variante dans disposer d'une correction _fresque_. Il est possible de gagner du temps dans la création d'une nouvelle Fresque en important toutes les cartes d'une autre Fresque. Concrètement, cela vient à dire : "

Par exemple, pour le passage de la v8.4 à la v9 de la Fresque du Climat, comme seulement la carte 42 du lot 5 a changé :
* les corrections des lots 1 à 4 sont identiques (on a indiqué que chacune de ces corrections s'applique à la fois à la v8.4 et à la v9.0)
* les corrections complètes (lot 5) sont différentes. Néanmoins, la correction du lot 5 de la v9 a été initialisée à partir de celle de la v8.4.

### 6/ Mettre à jour la version par défaut et déprécier les anciennes

### 7/ Indiquer pour chaque langue où trouver les pdfs
