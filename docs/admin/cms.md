# Utilisation de l'interface d'administration

## Principe général

D'une manière qui peut sembler contre-intruitive, la modification des données du mémo est réalisée en deux temps :
1. On modifie les cartes, liens, fresques et configuration, sans se poser de questions, tout est sauvegardé automatiquement en local dans son navigateur internet ;
2. Une fois satisfait·e des modifications effectuées, on les passe en revue puis on les publie sur le mémo ;

En cas de fausse manipulation ou pour toute autre raison, il est possible, en se rendant sur le projet Gitlab, de parcourir ou d'annuler tout ensemble de modifications (voir la page [dédiée aux développeur·euses](admin/dev) pour en savoir plus).

### Les modifications en local

?> Suivant la configuration de votre mémo, cette étape ne requiert pas nécessairement d'être authentifié·e. En l'occurence, cela dépend de si le repository Gitlab est public ou privé.

L'interface d'administration est voulue comme assez intuitive à prendre en main. Si certaines manipulations semblent contre-intuitives, ne pas hésiter à contacter l'équipe de développement pour que cela soit amélioré.

Pour des raisons de performance, les données des cartes ne sont téléchargées que lorsque cela est nécessaire. C'est pour cette raison qu’il y a parfois des points d’interrogation.

Les longs textes peuvent être mis en forme en _Markdown_, voir la [page dédiée](/admin/markdown) de cette documentation.

### Sauvegarde

Toutes les modifications sont automatiquement sauvegardées dans le navigateur, c’est-à-dire que si on éteint son ordinateur et qu’on se connecte un peu après sur l’interface d’administration : les modifications restent.

Il est aussi possible de sauvegarder ces modifications au sein d’un fichier qui peut lui même être partagé à un·e autre utilisateur·ice en se rendant en bas de la page « Publier mes modifications ».


### Travail collaboratif

Il est tout à fait possible de contribuer à plusieurs en même temps au mémo. Dans ce cas, il est recommandé de définir les « territoires de chacun·e » et de réaliser des publications régulièrement.

Dans le cas où plusieurs personnes contribuent en même temps au mémo alors :
* **Cas 1** : Les deux personnes modifient des éléments différents, Par ex. Alice modifie la carte 1 tandis que Alain modifie la carte 17. Alors il n’y a aucune difficulté, et ce quelque soit l'ordre dans lequel Alain et Alice publient leurs modifications ;
* **Cas 2** : Si Alice et Alain souhaitent modifier le même élément, par exemple le titre de la carte 1. Supposons que le titre était « Carte 1 : la vie », qu'Alice veuille le changer en « Carte 1 : le vivant » et Alain en « Carte 1 : les êtres vivants ».
Alors :
    1. Alice et Bob vont tous les deux voir sur leur ordinateur « Carte 1 : la vie » et vont remplacer le titre par ce qu’iels veulent ;
    2. Ensuite, la première personne (disons Alice) va cliquer sur « publier ».
    3. Le titre de la carte 1 sur le mémo est alors le titre choisi par Alice « carte 1 : le vivant »
    4. Au moment de publier, Alain va alors voir que sa modification n'est plus de changer « Carte 1 : la vie » en « Carte 1 : les êtres vivants » mais « Carte 1 : le vivant » en « Carte 1 : les êtres vivant·e·s ». Charge alors à Alain de décider s’il souhaite garder sa proposition ou celle d’Alice.
* **Cas 3** : Les deux personnes souhaitent faire exactement la même modification, à la virgule près : dans ce cas, seule les modifications de la première personne qui publie sont prises en compte.
Dans


### La publication des modifications


Pour accéder à la page de publication, cliquer sur le bouton en haut à droite _« Publier vos modifications »_ (autrement se rendre à l'url `/admin/#/fr-FR/save`).

La page présente alors une vision synthètique de toutes les modifications _en attente de publication_. Pour chacune des modifications on voit : l'intitulé de l'élément modifié (par ex. « Titre de la carte 1 »), l'ancienne et la nouvelle valeur.
Il est alors possible **d’annuler** une modification (en cliquant sur le bouton avec la flèche).

Une fois satisfait·e des modifications effectuées, il faut rédiger une description des modifications qui ont été effectuées (quelles modifications ? pourquoi ?). Cela est très important pour assurer un suivi et garantir la qualité des informations présentes dans le mémo.

Quelques exemples :
* _Mise à jour de l’explication avec les données de novembre 2023_
* _Copié-collé des explications depuis le guide d’auto-formation_
* _Suggestion reçue par email de XXX_

!> Ces textes sont **publics** dans le cas où le repository est public et sont sinon, théoriquement accessibles à n’importe quel·le détenterice d’un token de modification du mémo.

Une fois le texte rempli et avoir cliqué sur le bouton « Publier », les modifications sont enfin sauvegardées sur le serveur, elles apparaîtront sur le mémo après quelques minutes (voir section suivante).

!> **Il y a un bug et la sauvegarde n’a pas fonctionné ?** Il est fondamental de télécharger une copie des modificatinos sur son ordinateur. Ces modifications pourront ensuite être rechargées facilement dans le mémo. Sans cela, votre travail risque d’être perdu.

### Mise à jour du mémo

Le mémo est un site statique, cela signifie notamment qu’il y a besoin d’une étape de _génération_ du site internet (aussi appelée _étape de compilation_ ou _build_) qui consiste en : (1) récupérer la dernière version du logiciel du mémo et des données, (2) générer toutes les pages du mémo ; (3) Charger les pages (fichiers HTML, CSS et JS) sur le serveur.

Ces étapes sont déclenchées automatiquement au moment de la sauvegarde, cela prend quelques minutes (dépend de la taille du mémo, et notamment du nombre de langues).

Il n'est pour le moment pas possible de savoir dans l'interface d'administration où en est cette étape, il faut se rendre sur le projet Gitlab (ticket [#201](https://framagit.org/memo-fresques/memo-viewer/-/issues/201)).
Une solution alternative est de se rendre sur la page _À propos_ du mémo où il est écrit, tout en bas, la date et l'heure de la _compilation_ de la version courante du mémo.

?> Le mémo ne s’est pas mis à jour 10 min après vos modifications ? C'est probablement qu’il y a un problème technique hors de votre portée, contacter qqn·e :)



## Fonctionnalités

?> L'interface d'administration ne permet pas de modififier l'intégralité du mémo. Seuls les fonctionnalités utiles sont ajoutées lorsqu'elles sont exprimées de manière réactive.


### ✅ Fonctionnalités existantes :
* **Cartes** :
    * Ajout ou changement d'explications, du titre du texte derrière la carte dans n'importe quelle lange
    * Ajout, édition, suppression des liens "Instagram", "Wiki" et vidéos Youtube ;
    * Changement du numéro de la carte et de son numéro de lot ;
    * Création de nouvelles cartes
* **Liens**
    * Création et suppression de liens
    * Changement du statut d'un lien (valide, invalide, optionnel)
    * Changement, ajout, suppression de l'explication d'un lien dans n'importe quelle langue
* **Fresques** :
    * Déplacement des cartes
    * Affichage supplémentaire de cartes

### ❎ Fonctionnalités absentes de l’interface d’administration (mais réalisables directement en trifouillant le mémo)
* **Cartes** :
    * Modification des images des cartes
    * Suppression de cartes
* **Fresques**
    * Changement de la taille de certaines images
    * Personnalisation des liens
    * Création de nouvelles fresques
    * Personnalisation du _plateau de jeu_
* **Configuration** : au moment d’écriture de cette documentation (décembre 2023), cela est un gros point noir du mémo. Pour autant, ce ne sont pas des éléments qui changent très régulièrement
    * Changement de la police de caractère principal
    * Changement des couleures primaire et secondaire
    * Changement du texte de la page _À propos_
    * etc.

