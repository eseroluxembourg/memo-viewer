# Guide : devenir autonome avec son mémo

?> Vous avez bénéficié d'une mise en place initiale du Mémo et souhaitez désormais terminer de le compléter avant de le rendre disponible aux membres de votre Fresque ? Ce guide synthétise les différentes étapes pour y arriver.

**Pré-requis** : disposer d'un mémo fonctionnel, accessible en ligne et qui contient les cartes de votre jeu, aux couleurs de votre Fresque.

Vous avez en particulier besoin :
* de l'url de votre mémo, et des éventuels identifiants pour y accéder ;
* d'un identifiant pour accéder à l'interface d'administration

## 🅰️ Que compléter sur le mémo ?

En l'état, le mémo ne contient que les cartes, leurs images et les numéros de lot mais aucune information spécifique à votre Fresque.

Votre rôle va être :
* d'ajouter les liens cause-conséquences entre les différentes cartes ;
* d'ajouter les explications complémentaires pour chaque carte ;
* d'ajouter les explications complémentaires pour chaque lien cause-conséquence ;
* de dessiner les corrections lot par lot ;

Plus toutes ces informations seront ajoutées dans le mémo, plus le mémo sera utile pour les animateur·ices !

## 🅱️ Comment modifier ?

Avant d'expliquer comment modifier ces différentes données, il faut comprendre comment est construit votre mémo.

Tout repose sur un « projet Framagit » qui contient une sorte de cloud où est stocké l'intégralité des données de votre mémo. Chaque carte y est représentée comme un fichier texte. Lorsque le contenu du projet Framagit change, le mémo est automatiquement mis à jour, avec quelques minutes de retard. Par conséquent, pour modifier les données affichées sur le mémo, il faut modifier le projet Framagit.

Les modifications peuvent être faites directement _via_ l'interface web de Framagit, en faisant appel à des techniques classiques de développeur·euse (Framagit est en réalité un cloud pensé et conçu pour les dév) ou en utilisant une **interface d'administration** conçue pour le mémo.

**C'est donc en utilisant l'interface d'administration que vous pourrez compléter le mémo.**

_L'interface d'administration ne permet pas de tout modifier (cela ferait trop de développements à faire) donc pour certains besoins, il faudra passer par le projet Framagit, mais c'est rare, faire signe._

?> Au delà d'être un cloud, le projet Framagit contient un grand nombre d'outils utiles pour votre mémo, c'est ce projet qui gère la synchronisation avec le site web, s'assure que les données sont au bon format, synchronise votre mémo dès qu'il y a une nouvelle mise à jour du logiciel. L'outil permet de gérer différent·es utilisateur·ices, met à disposition un outil de ticketing pour suivre les différentes tâches en cours.

### 1️⃣ Obtenir ses identifiants pour l'interface d'administration

Pour vous connecter à cette interface, vous avez besoin d'un _token_. Un token vous a probablement été transmis par email, ce dernier a une durée de vie de quelques semaines. Au delà, vous devrez vous en générer un vous-même en vous connectant sur Framagit (voir [la procédure](/admin/dev)).

### 2️⃣ Se connecter à l'interface d'admininstration et s'authentifier

Vous pouvez vous rendre à l'url de votre mémo, à laquelle vous ajouter `/admin` à la fin. Par exemple : `https://numerique.memo.fresque.earth/admin/`.

Une fois sur la page d'accueil, vous devez copier-coller votre token dans le champ texte consacré. Pas besoin de cliquer, c'est automatique. Votre token reste sauvegardé dans la mémoire de votre navigateur : pas besoin de le remettre à chaque fois.

### 3️⃣ Naviguer dans le mémo et commencer la modification

Vous pouvez alors naviguer à l’aide du menu à gauche de l'écran, les données vont alors se charger : cela peut prendre un peu de temps (quelques secondes).

Trois sections vous intéressent en particulier :
* **cartes** : pour modifier les informations relatives aux cartes (numéro de lot, titre, explications) ;
* **liens** : pour modifier les informations relatives aux liens inter-cartes ;
* **fresques** : pour créer les corrections graphiques lot par lot ;

À vous d'utiliser ces différentes sections pour mettre à jour toutes les données relatives à votre jeu !

À noter que les différents textes d'explication peuvent être écrits en **gras**, _italique_, intégrer des liens ou des notes de bas de page ! En savoir plus sur le [markdown](/admin/markdown)

### 4️⃣ Sauvegarder votre travail

Toutes les modifications que vous effectuées sont automatiquement sauvegardées **sur votre ordinateur uniquement**. Si vous fermez et rouvrez votre navigateur, votre travail est conservé. Par contre, il n'est pas publié sur le mémo.

Pour publier vos modifications et les rendre accessible aux animateur·ices, il faut cliquer sur le bouton « Publier vos modifications ». Vous pourrez alors passer en revue toutes les modifications que vous avez effectuées. Tout en bas de la page, il y a un bouton pour publier. Et pour pouvoir cliquer dessus, il est nécessaire d’avoir préalablement rédigé quelques mots sur ce que vous venez de faire ("Ajout de la carte 10", "Modification des explications", "Corrections orthographiques").

?> Les textes d'explication sont utiles car, à la différence d'un cloud classique, les données dans le projet Framagit sont _versionnées_. C'est-à-dire qu'on sauvegarde l'historique complet de toutes les modifications effectuées. Cela peut être très utile pour annuler des modifications ou pour travailler à plusieurs.

!> **Vous rencontrez un bug ?** et vos données ne se publient pas ? Vous pouvez à tout instant télécharger sur votre ordinateur un fichier qui récapitule toutes les modifications que vous souhaitez publier. Ce fichier peut être chargé plus tard ou transmis aux équipes de support pour debug et éviter de perdre votre travail.

### 5️⃣ Aller au delà

D'autres modifications sont possibles, telles que la mise à jour des logos, le changement des couleurs, l'intégration de nouvelles polices de caractères, l'ajout des cartes dans d'autres langues, le changement des couleurs des flèches, etc.

Certaines de ces personnalisations sont faisables dans l'interface d'administration, d’autres nécessitent de passer par le projet Framagit directement. Pour un tel usage avancé, de nombreuses ressources existent sur ce [site internet](/admin/).