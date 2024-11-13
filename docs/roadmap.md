# Feuille de route

## Calendrier général du projet

Le projet du mémo s’articule autour de quatre grande phases. Au départ, il s’agit de commencer avec une seule Fresque et de s’assurer de répondre à ses besoins (phase 1). Ensuite, adapter le code du mémo pour élargir à 3 ou 4 Fresques et développer les différents outils nécessaires pour cela (phase 2). Une fois tous ces outils développés, adresser l’intégralité des Fresques (phase 3) pour enfin améliorer le mémo à la marge (phase 4).

### ✅ Phase 1 - Valider le mémo auprès de la Fresque du Climat

**Temporalité** :  2020 - février 2023

De 2020 à 2022, il s'agissait de réaliser un mémo qui répond adapté aux besoins de la Fresque du Climat avec toutes lse fonctionnalités clés côté utilisateur·ices : affichage des cartes et des explications, gestion multi-langue, vision _Fresque_.

Pendant toute cette période, la maintenance du mémo était réservée aux personnes expertes car il était nécessaire de modifier _à la main_ les différents fichiers json.


### Phase 2 - Rendre possible la généralisation du mémo

**Temporalité** : 2023

Après avoir validé lors d’une première phase l’outil auprès d’une unique Fresque, un important travail a été réalisé lors de l’hiver 2022 pour permettre à d’autres Fresques de disposer de leurs propres mémos administrés en autonomie.

En pratique cela implique les tâches suivantes :
* accélération du temps de génération du mémo : passage à un mode SSR + Vite au lieu d’un pre-renderering
* les explications des cartes sont stockées dans des fichiers markdown (un fichier par explication et par langue) et non plus dans un unique fichier json ;
* création d’une [interface d’administration](/admin/) pour modifier les explications des cartes sans connaissances en informatique ;
* simplification du processus de création d’un nouveau mémo avec le développement d’un [package yeoman](/deploy/yo-generator) ;
* créer un site web de ressources sur le mémo : documentation, journal de bord des modifications, explications diverses… : [memo.fresque.earth](https://memo.fresque.earth) ;
* amélioration des [algorithmes de manipulation des images](/admin/cards) des cartes de la Fresque pour traiter les différents formats de jeux ;
* dévelopement d'outils de vérification de la structure des fichiers ;
* création d’outils pour simplifier les mises à jour des différents mémo ;

Pour travailler à cette généralisation, il a été décidé de co-construire ces outils avec trois fresques supplémentaires :
* la Fresque du Numérique
* la Fresque des Inégalités
* la Fresque des Frontières Planétaires

### Phase 3 - Passer à l’échelle, adresser toutes les Fresques

**Temporalité** : 2024

Il existe plus d'une trentaine de Fresques avec un fonctionnement similaire à la Fresque du Climat et qui seraient intéressés(*) pour proposer à leurs animateur·ices un outil pour les aider à s’approprier le jeu et à avoir toutes les explications en main (un mémo 😉).

L'objectif est de pouvoir créer des mémos en y consacrant un minimum de temps (4h ?) :
* créer une version minimale du mémo à partir de la version pdf des cartes fournies par la structure ;
* mettre en ligne ce mémo (incluant mémo, interface d'administration et Matomo) avec recréation automatique à chaque mise à jour du contenu ;
* former les organisations à l’utilisation de l’interface d’administration (documentation à compléter)

Le projet du « Mémo des Fresques » n’est pas seulement d’être un « outil aux services des Fresques » mais un « commun numérique ». Pour cela, il est important que les Fresques s’emparent de cet outil _en tant que communauté_. Des réflexions et des échanges autour de l'élaboration de cette commuanuté pourraient avoir lieu.<br/>
L'enjeu est aussi très concrètement de pouvoir permettre aux Fresuqes d'échanger sur leurs pratiques du mémo et en particulier de comment le mémo est mis à jour : par des salarié·es ? par des animateurices trié·es sur le volet ?<br/>

(*) Une douzaine de Fresques ont déjà été contactées et la majorité d’entre elles sont intéressées pour mettre en place un mémo.


### Phase 4 - Maintenir et faire évoluer l’outil pour chaque Fresque, envisager d’autres applications pour le mémo ? envisager d'autres outils pour les Fresques ?

**Temporalité** : 2025 ?

Une fois que toutes les Fresques utiliseront le mémo, il y aura probablement quelques nouvelles fonctionnalités à rajouter pour coller au plus près aux besoins de chaque Fresque.

Une fois que cela est fait, il serait intéressant de réfléchir à d’autres domaines où le mémo pourrait s’appliquer ?

## Fonctionnalités à rajouter

Ci-dessous une liste de fonctionnalités plus ou moins matures qui devraient être ajoutées au mémo :

* développer **une nouvelle page d'accueil** pour donner plus d'éléments aux visiteur·ices et leur permettre de trouver rapidement la réponse à leur question (ticket [#193](https://framagit.org/memo-fresques/memo-viewer/-/issues/193))
* supporter le  **multi-versions** et notamment les **fresques juniors** (ticket [#195](https://framagit.org/memo-fresques/memo-viewer/-/issues/195))
* permettre l’export **multi-format** du mémo. Actuellement, les données sont exportées uniquement au format _site web_ mais des formats pdf pourraient être intéressants (ticket [#196](https://framagit.org/memo-fresques/memo-viewer/-/issues/196))
* Créer un **formulaire de contribution** : pour permettre à chaque internaute de suggérer des modifications dans le mémo (ticket [#187](https://framagit.org/memo-fresques/memo-viewer/-/issues/187))
* Afficher les textes d’explications (cartes et liens) sur la _vue fresque_ (ticket [#182](https://framagit.org/memo-fresques/memo-viewer/-/issues/182))
* Améliorer **l'accessiblitié** du mémo (contrastes, expérience utilisateur, lecteur d’écran, etc.) (ticket [#69](https://framagit.org/memo-fresques/memo-viewer/-/issues/69))
* Améliorer **les performances environnementales** du mémo (ticket [#129](https://framagit.org/memo-fresques/memo-viewer/-/issues/129))
* Travailler **l'expérience utilisateur·ice**
* **Refonte du design** et notamment du choix des couleurs, création d'une identité graphique propre au mémo
* Permettre la création de **visions fresques** personnalisées (ticket [#177](https://framagit.org/memo-fresques/memo-viewer/-/issues/177))
* Créer une **application mobile**, ou tout du moins permettre une lecture _offline_ du mémo (ticket [#126](https://framagit.org/memo-fresques/memo-viewer/-/issues/126))
* Ajouter des explications **hors cartes** pour les animateur·ices : sur l'animation en elle même ?
* Possibilité de modifier plus de paramètres du mémo directement dans l'interface d'administration
* Gestion de version de _pré-production_ dans le mémo pour permettre aux animateur·ices de modifier le mémo et de faire valider leurs modifications par un·e administrateur·ice
* Mise en évidence des éléments qui ont changé dans un long texte (quels mots ont été ajouté·e·s ?) (voir ticket [#203])(https://framagit.org/memo-fresques/memo-viewer/-/issues/203)

Et ci-dessous quelques idées plus exploratoires :
* intégrer au mémo l'outil libre de _génération de cartes_ en cours de développement par la Fresque du climat
* Ajouter des **jeux** pour permettre aux animateur·ices de réviser le jeu
* En faire un support pour des animations **en ligne** (en remplacement de _Mural_ ou _Miro_)
* Revue et modification de l'historique des modifications apportées sur le mémo avec notamment la posssibilité d'annuler certaines modifications (après une fausse manip) ;