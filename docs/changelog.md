
# Changelog

_Ou journal de bord des nouvelles fonctionnalités, version par version_.

Le changelog est également publié sur [Telegram](https://t.me/+EB9mGj24fE5kNDdk).

## Version 1.16.0. Synchronisation avec Tolgee
(04-11-2024)

Nouvelle fonctionnalité : on peut désormais **synchroniser les chaînes de traduction** avec une instance du logiciel [Tolgee](https://tolgee.io/). Grâce à la [Fresque du Climat](https://fresqueduclimat.org) les chaînes de traduction du mémo en lui même sont désormais synchronisées. Lorsque des nouvelles traductions sont disponibles, une merge request est automatiquement créée et les traductions sont ajoutées sur simple validation manuelle.

Il est également possible de traduire les données de sa propre Fresque et de synchroniser automatiquement avec Tolgee, sans manipulation humaine supplémentaire. C'est ce qui est activé pour la Fresque du Climat.

Cette synchronisation est basée sur un petit utilitaire [TolgitBot](https://framagit.org/Marc-AntoineA/tolgitbot/) fait pour l'occasion et également utilisé pour [Aktivisda](https://aktivisda.earth/#/fr/).

Cette fonctionnalité a été éprouvée ces derniers mois et est enfin suffisamment mature pour être mise en production, elle résout ainsi le ticket [#235](https://framagit.org/memo-fresques/memo-viewer/-/issues/235).

Par ailleurs, ajout d'un « test de qualité » pour s'assurer de la bonne mise en forme du code à chaque nouvelle version (voir ticket [#245](https://framagit.org/memo-fresques/memo-viewer/-/issues/245)).

## Version 1.15.0. Mse en place d'une infrastructure de test robuste
(17-09-2024)

Cette version corrige un léger bug. Lorsqu'on était en train de regarder une ancienne version des cartes et qu'on changeait des langues, le lien n'était pas mis à jour avec la nouvelle langue. Par conséquent, en cliquant dessus, la langue de l'interface changée (voir ticket [#258](https://framagit.org/memo-fresques/memo-viewer/-/issues/258)). Ce bug semble être d'origine.

La correction de ce bug a été le prétexte pour enfin mettre en place une infrastructure de tests d'intégration complet. L'idée générale est de créer un mémo fictif et de tester automatiquement un certain nombre de fonctionnalités du mémo. À l'avenir, pour s'assurer de la non-régression d'une fonctionnalité, il suffira d'ajouter un test et ce dernier sera vérifié automatiquement.

Cette nouvelle infrastructure de tests permettra d'améliorer la qualité du code à l'avenir.

Pour en savoir plus sur cette infrastructure de tests,  [une page](/dev/tests.md) a été ajoutée à ce site.

Par ailleurs, en micro-fonctionnalité, lorsqu'on utilise le générateur `yeoman`, les réponses aux questions sont désormais sauvegardées dans un fichier `.yo-rc.json`. Ces réponses peuvent être lues (et donc non posées) en utilisant l'option `--yo-rc`.

## Version 1.14.1. Correction d'un bug sur l'affichage des langues
(12-09-2024)

Suite à la mise à jour 1.14.0, les images des cartes dans les vues avec toutes les cartes étaient en anglais (dans la langue par défaut) (voir ticket [#257](https://framagit.org/memo-fresques/memo-viewer/-/issues/257)). Le problème était directement causé par le refactoring.

Par ailleurs, dans la vue Fresque, le nom de la carte, affiché en bas de l'écran, ne se mettait pas à jour au changement de langue.

## Version 1.14.0. Amélioration de la base du code du mémo.
(04-09-2024)

Le  code du mémo a été mis à jour pour faciliter sa maintenance future : on utilise désormais VueJS avec TypeScript (le mémo utilisait déjà Vue3) avec la syntaxe *par composition* préconisée par Vue. Le style est désormais écrit en `sass`. L'ajout de Typescript s'accompagne également de l'ajout de nouvelles règles de lint. Et la logique a été revue au sein de différents composants pour faciliter le test futur (voir ticket [#245](https://framagit.org/memo-fresques/memo-viewer/-/issues/245)).

D'un point de vue utilisateur·ice, cette mise à jour ne devrait avoir aucune influence, sauf des bugs qui seraient malencontreusement passés à travers notre grille de tests automatiques et manuels.


## Version 1.13.0. Automatisation de la mise en place du serveur avec Ansible et corrections de bugs dans l’admin
(26-07-2024)

La Fresque de la Clinique Vétérinaire dispose désormais d’un mémo. Dans le cadre de ce déploiement, la phase de création du serveur a été automatisée en vue de toujours plus simplifier et automatiser la création d'un mémo : la procédure basée sur Ansible est [accessible sur ce site](/deploy/server).

Des améliorations diverses dans la documentation, et la création d'un guide [devenir autonome](admin/devenir-autonome) pour accompagner les utilisateurices dans la prise en main d'un mémo dont l'installation aurait été faite par [TelesCoop](https://www.telescoop.fr/).

Quelques petites corrections de bugs dans l'interface d'admin.

Nouvelle micro-feature sur demande de la Fresque Océane : il est désormais possible d'exporter les Fresques en image haute qualité directement depuis l'interface d'administration (bouton avec un appareil photo) (voir ticket (#250)(https://framagit.org/memo-fresques/memo-viewer/-/issues/250)).

## Version 1.12.0. Affichage d'une légende lorsque des styles personnalisés sont utilisés
(23-07-2024)

Depuis la version 1.9.0 on peut définir des styles pour chaque flèche pour spécifier notamment la couleur ou bien si les flèches apparaissent en pointillé ou non.

Désormais, une légende est automatiquement générée dès que des styles sont définis. Pour cette raison, il est désormais impératif de spécifier des labels pour chaque classe personnalisée définie (voir ticket [#246](https://framagit.org/memo-fresques/memo-viewer/-/issues/246)).

Cette fonctionnalité a été développée bénévolement par TelesCoop pour l'usage de la [Fresque Océane](https://www.fresqueoceane.org/).

## Version 1.11.2. Corrections de deux bugs côté serveur et côté interface d'administration
(22-06-2024)

D'une part, les liens ajoutés via l'interface d'administration étaient désormais cassés car ne respectaient pas le bon format (voir ticket [#241](https://framagit.org/memo-fresques/memo-viewer/-/issues/241)).

D’autre part, on a remarqué que sur le Mémo de la Fresque Océane, si on chargait la page _Correction Fresque_ puis qu'on double cliquait sur une carte alors cela plantait (voir ticket [#242](https://framagit.org/memo-fresques/memo-viewer/-/issues/241)). En creusant, il est ressorti plusieurs problèmes au niveau du rendu serveur :
* les fichiers html des pages `cards/network`, `cards/list` et `cards/grid` n'étaient pas envoyés sur le serveur (sauf pour la Fresque du Climat) 👉 Mise à jour de la commande de synchronisation
* les fichiers des cartes n'étaient pas lus par le serveur 👉 mise à jour du fichier de configuration Nginx utilisé (voir [la page dédiée](/deploy/server))
* encore quelques problèmes _« d'hydration mismatch »_ corrigés


## Version 1.11.1. Correction erreur dans la précédente version

Les numéros de cartes sont parfois non pas des chaînes de caractères mais directement des nombres, la fonction ajoutée dans la version 1.11.0 ne permettait pas de gérer ça.

## Version 1.11.0. Gestion de la numérotation des cartes de la Fresque Océane
(19-06-2024)

Cette nouvelle version permet de gérer la numérotation particulière de la Fresque Océane (voir ticket [#230](https://framagit.org/memo-fresques/memo-viewer/-/issues/230))

Cette nouvelle fonctionnalité est assortie de tests unitaires pour s'assurer que de futures modifications des fonctions de comparaison.

**En savoir plus** :
Dans le mémo, les cartes sont ordonnées selon leur numérotation : affichage dans la liste de toutes les cartes et boutons pour aller vers la carte précédente ou la carte suivante. Ces numérotations sont différentes selon les différentes Fresques : pour la Fresque du climat, les numérotations sont des nombres, il suffit donc de les trier directement : la carte _3_ est avant la carte _13_. Pour la Fresque du Numérique, certaines cartes ont des nombres, d’autres ont des letttres et d'autres sont une combinaison lettre + chiffres, par ex. _S1_. Dans ce cas, on veut notamment afficher la carte _S4_ avant la carte _S15_.
Ces deux cas étaient gérés jusqu'à présent, mais n'étaient pas suffisants pour la Fresque Océane où les cartes sont numérotées avec le numéro de lot et un numéro interne par lot, par exemple : `6.12` ou `4.01`.


## Version 1.10.3. Ajout de la traduction espagnole du mémo 🇪🇸
(27-05-2024)

La traduction espagnole a été réalisée par les animateur·ices et traducteur·ices de la Fresque du Climat. Cette traduction a été réalisée sur le logiciel [Tolgee](https://tolgee.io/) qui est en cours de synchronisation avec le code du mémo (voir ticket [#235](https://framagit.org/memo-fresques/memo-viewer/-/issues/235)).

D'autres traductions devraient arriver rapidement grâce à cette synchronisation et avec l'aide des nombreux·ses contributeurices de la Fresque du Climat. Merci à elleux ! 🎉

## version 1.10.2. Corrections de bugs dans la pré-génération du mémo
(16-05-2024)

La consommation mémoire augmente à chaque page pré-générée de sorte à ce que la pré-génération du mémo de la Fresque du Climat soit désormais impossible. Le problème de la fuite mémoire ne semble pas critique car il semble être uniquement du côté serveur. En attendant d’éventuellement le corriger à l'avenir, une solution de contournement a été mise en place. Les pages sont prégénéres par paquets de 50 pages afin de maintenir une consommation mémoire limitée voir ticket [#238](https://framagit.org/memo-fresques/memo-viewer/-/issues/238)).

La pré-génération des cartes semblait cassée depuis quelques versions, sans grande incidence pour l'utilisateur·ice, corrigé.

Par ailleurs, depuis la version 1.9.0, les liens "invalides" étaient représentés sur la correction. Ces liens sont désormais cachés (peut-être pourraient-ils être affichés avec une légende ?).

## Version 1.10.1. Correction d'un bug de choix de la langue à afficher lors de traductions partielles
(16-05-2024)

Lorqu'une carte est partiellement traduite, et particulier si le titre est traduit mais pas les explications, on souhaite afficher le titre dans la bonne langue, et les explications en anglais (ou dans une autre langue qui nous semblerait plus intelligente). Il y avait un bug dans le code qui détectait si des explications étaient présentes ou non : une explication contenant uniquement un saut de ligne était considérée comme complète et donc on avait l'impression que la carte était traduite. Woops.

## Version 1.10.0. Dessin de chemins svg en arrière plan de la Fresque
(12-05-2024)

Possibilité de dessiner des formes quelconques (en l'occurence des svg path) en arrière plan de la Fresque, de manière à créer un plateau de jeu. Il s'agissait d'une demande de la [Fresque Océane](https://www.fresqueoceane.org/) afin de dessiner des _pyramides_ autour des cartes (voir ticket [#229](https://framagit.org/memo-fresques/memo-viewer/-/issues/229)).

## Version 1.9.0. Choix du design des flèches
(08-05-2024)

Possiblité de changer le style pour chaque type de flèche sur les Fresques et en particulier indiquer que certaines flèches sont en pointillés ou d'une certaine couleur. Cette fonctionnalité sera utile à la Fresque Océane (voir ticket [#228](https://framagit.org/memo-fresques/memo-viewer/-/issues/228)). Pour en savoir plus sur cette modification, se référer à [cette documentation](/admin/fresks). En particulier, il n'est pas encore possible de modifier les styles directement dans l'interface d'administration (voir ticket [#236](.https://framagit.org/memo-fresques/memo-viewer/-/issues/236)).

## Version 1.8.2. Correction d'un bug du non affichage de la mention Matomo (et de l’opt-out) au premier chargement
(03-03-2024)

La page _À Propos_ affiche un opt-out pour Matomo mais ce dernier n'apparaissait que lorsque la page "À propos" était affichée en cliquant via le menu mais pas avec l'url directe. Ce bug en question était lié à une particularité dans le chargement de Matomo et à un problème dans la manière dont cette page est prégénérée (voir ticket [#231](https://framagit.org/memo-fresques/memo-viewer/-/issues/231)).

Autres fonctionnalités et corrections de bugs :
* feat: on vérifie désormais que les variantes _par défaut_ ne sont pas non plus _dépréciées_ (ce qui serait tout bonnement illogique) ;
* bug: la compilation échouait lorsqu'un fichier `.gitkeep` était présent ans le répertoire `public/local/logo/logo`

## Version 1.8.1. Possibilité d'ajouter un fichier de configuration `.htaccess` au mémo
(03-03-2024)

La difficulté dans le déploiement du mémo est que beaucoup de pages sont pré-générées mais pas toutes. Il faut donc indiquer au serveur web de servir les pages web lorsque disponible, et sinon la page `index.html`.

Dans le cas d'un serveur Apache, on peut ajouter un fichier `.htaccess`. Ce fichier peut désormais être versionné.
(voir section [déployer le mémo](/deploy/server)).

## Version 1.8.0. Gestion des cartes avec uniquement un recto pour la Fresque Océane
(29-02-2024)

- feat: ajout de la possibilité de gérer des cartes avec uniquement un recto (voir ticket [#229](https://framagit.org/memo-fresques/memo-viewer/-/issues/229))

Cette fonctionnalité a été développée bénévolement par [TelesCoop](https://telescoop.fr) pour la [Fresque Océane](https://www.fresqueoceane.org/) et la [Fresque de l'Alimentation](http://fresquealimentation.org/).

## Version 1.7.3. Améliorations de l'interface d'administration et de la documentation pour la Fresque Océane
(21-02-2024)

Dans le cadre du déploiement du mémo de la Fresque Océane, plusieurs améliorations ont été réalisées.

**Admin**
* feat: amélioration de l'affichage du statut d'un token gitlab : un message apparaît temporairement lorsque le token renseigné est correct et il y a un message d’erreur spécifique en cas de token faux. Le message d'erreur disparaît si un token correct est renseigné (voir tickets [#207](https://framagit.org/memo-fresques/memo-viewer/-/issues/207) et [#223](https://framagit.org/memo-fresques/memo-viewer/-/issues/223)).
* wip: brouillon d'une page pour pouvoir modifier dynamiquement les fichiers `pdfformats`. Cette page n'est pas encore aboutie (elle devrait pouvoir l'être à la prochaine Fresque ajoutée ?). L'intérêt actuel est de pouvoir visualiser que les pages pdf renseignées correspondent bien à la carte voulue et de pouvoir _facilement_ traiter une nouvelle page car les valeurs sont correctement initialisées (alternance recto/verso et page + 1). Cette page n'est pas accessible _via_ le menu de gauche pour le moment. Il est nécessaire de (1) créer un fichier `pdfformat-xxxx.json` dans `moulinette-data` et (2) accéder à l'interface d'administration à l'url `/admin/#/fr-FR/pdfformat/pdfformat-xxxx.json` (bien penser à ce que le fichier soit commité pour qu'il soit accessible par le CMS). Cette page permet également de rogner les pages ou de les tourner (voir ticket [#212](https://framagit.org/memo-fresques/memo-viewer/-/issues/212))
* feat: ajout de la possibilité d'ajouter des cartes (pas de les supprimer encore)

**Documentation** :
* Amélioration de la page « Mise en place initiale » avec le retour d'expérience de la Fresque Océane (et légères modifications du package `yeoman`) (voir ticket [#225](https://framagit.org/memo-fresques/memo-viewer/-/issues/225))
* Mises à jour diverses dont ajout de la Fresque Océane dans la liste des Fresques et ajout du lien Télégram (voir ticket [#220](https://framagit.org/memo-fresques/memo-viewer/-/issues/220))

## Version 1.7.2. Ajout de la traduction allemande du mémo
(15-02-2024)

🙏 Ajout de la traduction allemande du mémo (pas de l’interface d'administration) par Ollivier Bonnet.

## Version 1.7.1 Corrections mineures dans l'interface d'administration
(09-02-2024)

**Admin**
* L'interface d'administration créait des liens _faux_ qui ne passaient pas l'étape de validation mise en place dans la version 1.7.0. Cela cachait un bug dans une fonction utilitaire pour tirer au sort un élément dans un tableau. Cette fonction renvoyait l'indice dans le tableau au lieu de l'élément du tableau (voir ticket [#221](https://framagit.org/memo-fresques/memo-viewer/-/issues/221))
* Correction d'un bug sur la page « Publier vos modifications » liée à la présence de certains champs "nombre" au lieu de "chaînes de caractères".

## Version 1.7.0. Gestion des versions
(26-01-2024)

**🙌 Cette mise à jour a en partie été rendue possible par le financement de [La Fresque du Climat](https://fresqueduclimat.org/).**

Ajout de la notion de _versions_ dans le mémo (ticket [#195](https://framagit.org/memo-fresques/memo-viewer/-/issues/195)). Cela permet par exemple d’avoir simultanément les versions v9 et v8.4 de la Fresque du Climat ainsi que la version _junior_ du jeu.<br>
👉 Pour en savoir plus [sur les variantes et comment les mettre en place](/admin/variants).

Changements majeurs apportés :
* les urls du mémo évoluent avec l'ajout de la variante courante juste après la langue `/en-GB/card/17` ➡️ `/en-GB/v9.0/card/17`
* les images des cartes sont désormais stockés dans des sous-dossiers par variante ;

**Génération des cartes / moulinette** :
* feat: ajout d'une étape de compression du pdf _en place_ (fonction issue de [images-manipulator v0.0.7](https://framagit.org/Marc-AntoineA/files-manipulator))
* fix: moulinette résiliente aux couleurs `icc` présentes sur certains pdfs des cartes des Fresques ;
* feat: les générations des cartes sont désormais entièrement gérées par le script `moulinette.py`qui s'appuie sur le fichier `variants.json`, indiquant pour chaque couple (lang, version) l'url où trouver le pdf ainsi que la _table de conversion_ pdf −−> cartes.

**Admin** :
* feat: on peut changer la branche de travail ;
* feat: sur le tableau avec la lisste des cartes, on voit désormais le numéro du lot, le numéro de la carte et les variantes dans lesquelles la carte apparaît ;
* feat: pour des variantes déjà existantes, on peut ajouter ou supprimer des illustrations dans
différentes langues ;
* feat: Sur la page « revue des modifications avant publication », les changements effectués sont désormais mis en valeur (rouge pour des suppression, vert pour des ajouts, gris autrement). Cela a été réalisé grâce au plugin Javascript [jsdiff](https://github.com/kpdecker/jsdiff) (voir ticket [#203](https://framagit.org/memo-fresques/memo-viewer/-/issues/203))
* feat: ajout d'une manière de reporter les positionnements des cartes d'une Fresque à une autre (voir ticket [#189](https://framagit.org/memo-fresques/memo-viewer/-/issues/189))
* feat: on peut désormais créer des Fresques dans l'interface d'administration
* en cours: début de la création d'une page pour gérer les mises en production directement depuis l'interface d'administration. Cela serait notamment utile pour relancer les génération des cartes (voir ticket [#201](https://framagit.org/memo-fresques/memo-viewer/-/issues/201))

**Doc** :
* Création d'une page sur les variantes ;
* Mise à jour des différentes pages suite aux changements de format des données

**Mémo** :
* tests: vérification de la validité des données du mémo : est-ce que les fichiers `settings.json`, `variants.json` ainsi que les différents fichiers de cartes et de liens sont corrects (voir ticket [#70](https://framagit.org/memo-fresques/memo-viewer/-/issues/70)). Ces tests sont exécutés avant chaque déploiement (intégration continue sur Gitlab).
* feat: remplacement de la page de sélection des langues par un dropdown directement dans la barre de navigation. Le pays et la langue sont désormais également affichés, à condition qu'ils soient définis dans les différents fichiers de traduction.
* fix: le nom de la Fresque n’était plus affiché dans la vision Fresque
* feat: Avancement dans la possibilité d'avoir plusieurs Fresques pour un même lot (voir ticket [#177](https://framagit.org/memo-fresques/memo-viewer/-/issues/70)). Il est techniquement possible de créer plusieurs fresques mais seulement une est affichée pour le moment.
* feat: Ajout de la possibilité d’écrire des messages d'alertes (voir le store `meta`), pour par exemple indiquer que l'utilisateur·ice a été redirigé vers une nouvelle variante car la variante demandée n'est pas disponible dans sa langue ;
* changement: pour savoir dans quelles langues est disponible le mémo, on ne regarde plus les langues dans lesquelles sont disponibles les cartes mais directement le contenu du fichier `variants.json`. Le message dans les alertes est internationalisé, il est défini dans la section `alerts` des fichiers de traductions.

## Version 1.6.8. Notes de bas de page
(15-12-2023)

* feat: il est désormais possible d'ajouter des notes de bas de page dans les explications des cartes. Ces notes doivent être écrites en Markdown (voir [la documentation](/admin/markdown)). Les notes de bas de page peuvent être prévisualisées dans l'interface d'administration (voir ticket [#205](https://framagit.org/memo-fresques/memo-viewer/-/issues/205)).

**Doc** :
* style: Changement de la couleur de la documentation,
* fix: Amélioration du référencement et notamment ajout d'une balise titre et description (en français)
* style: les exemples de commande sont désormais mises en valeur dans des _terminaux_
* style: Ajout d'une icône pour le mémo (favicon)

**Admin**:
* fix: ajout d'un champ `meta noindex` pour que l'interface d'administration ne soit pas référencée par les moteurs de recherche ;
* feat: ajout d'un bouton "aide" dans l'éditeur Markdown avec redirection vers la documentation.
* style: travail sur la sidebar avec ajout des liens vers la documentation et le code source.

## Version 1.6.7. Documentation du CMS
(06-12-2023)

**Doc** :
* Réécriture complète de page [_« Utilisation de l'interface d'administration »_](/admin/cms) en reprenant les différents éléments normalement transmis à l'oral ;
* Création [d'une nouvelle page](/admin/dev) sur les backstage technique de l'interface d'administration
* Création [d'une nouvelle page](/admin/markdown) avec quelques billes sur le language Markdown et comment l'utiliser.

## Version 1.6.6. Documentation et simplification de la moulinette de génération des cartes

Toutes ces modifications ont eu lieu en travaillant à la mise en place d'un nouveau mémo pour « La Fresque de l'Alimentation ».

**Doc** :
* Comment mettre en place un mot de passe pour le mémo avec NGINX
* Amélioration du guide "Mise en place d'un mémo"
* Création d'une page _« Feuille de route »_ avec les grandes étapes du projet

**Package yeoman** (pour la mise en place initiale du mémo) :
* Ajout d'une image _« Carte inconnue »_ par défaut (pour le mode quiz)
* Amélioration du fichier `.gitlab-ci.yml` avec le mode « serveur accessible en ssh »
* Correction d'un bug dans une commande du fichier exemple `package.json` empêchant de lancer le mémo à partir de zéro ;
* Report de changements récents dans le fichier d'exemple `settings.json`
* Écriture d'un texte par défaut pour la description opengraph du mémo

**Génération des cartes** : Création d'un script générique pour réaliser la conversion : pdf ➡️ cartes. Ce script prend en entrée un fichier `json` qui spécifie où sont situées chaque carte dans le pdf.

## Version 1.6.5. Correction d'un bug d'affichage sur la vision _Carte_

**Mémo** : le verso de la carte était plus large que l’écran sur mobile (voir ticket [#197](https://framagit.org/memo-fresques/memo-viewer/-/issues/197))

**Doc** : Ajout d'une page sur les fonts et réécriture partielle de la page « Créer son mémo depuis zéro »

## Version 1.6.4. Traduction de l’interface d’administration et corrections de bugs

**CMS**:
* i18n: Support du multi-langue dans l'interface d'administration (anglais et français) et ajout d’un sélecteur de langue dans la barre de navigation (voir ticket [#176](https://framagit.org/memo-fresques/memo-viewer/-/issues/176))
* fix: Le numéro de lot est une chaîne de caractères, ce qui n’était pas encore le cas pour la Fresque des Frontières planétaire. Modifier une carte conduisait à dupliquer des lots. (voir ticket [#188](https://framagit.org/memo-fresques/memo-viewer/-/issues/188))
* fix: Possibilité de cliquer sur "Annuler" lors de l’ajout d’une carte ajoutée dans l’onglet Fresque (voir ticket [#185](https://framagit.org/memo-fresques/memo-viewer/-/issues/185))

**Mémo** :
* feat: les images sont chargées uniquement lorsqu’elles apparaissent sur l’écran. Cela permet d’accélérer le chargement de la page et de diminuer l’impact du mémo (voir ticket [#183](https://framagit.org/memo-fresques/memo-viewer/-/issues/183))
* test: mise en place de tests sur la structure json avec des schéma de validation sur les cartes et les liens (c’était déjà le cas pour les Fresques) (voir ticket [#70](https://framagit.org/memo-fresques/memo-viewer/-/issues/70))
* feat: support Matomo opt-out in about page
* feat: il est désormais possible de changer le texte "Tu veux améliorer cette explication" en bas de chage page en utilisant un mécanisme de _surcharge_ de n’importe quelle chaîne de traduction. À noter que cette fonctionnalité de surcharge est un contournement à utiliser avec précaution.
À ajouter à la fin du fichier `settings.json`
```json
"i18n": {
    "fr-FR": {
        "contribute.contribute-explanations": "< la chaîne surchargée>"
    }
}
```
(voir ticket [#192](https://framagit.org/memo-fresques/memo-viewer/-/issues/192))

**doc**:
* feat: ajout d’une page _« En route vers l’éco-conception »_ pour recenser ce qui est mis en place pour limiter l’impact du mémo ;
* feat: Ajout d'une page _« Pré-requis »_ pour lister les différentes ressources nécessaires à la mise en place d’un mémo
* feat: Ajout d'une page _« Analyser l’utilisation du mémo »_ sur Matomo  (voir ticket [#194](https://framagit.org/memo-fresques/memo-viewer/-/issues/194)).



## Version 1.6.3. Mise en place d'un linter

Correction d'un nouveau bug lié à une différence de comportement entre _version de développement_ et _version de production_. Ce bug rendait inacessible l'édition de liens et donc les fonctionnalités de la version 1.6.2.

Pour éviter que ce bug ne se reproduise à l'avenir, ré-introduction dans le code d'un _vérificateur_ lancé automatiquement à la génération du mémo (voir ticket [#184](https://framagit.org/memo-fresques/memo-viewer/-/issues/184)).

## Version 1.6.2. Correction de bug et affichage des cartes dans le CMS

* fix: Le bouton _prévisualiser_ de l'éditeur Markdown fonctionnait dans la version de développement mais pas dans la version de production à cause d’une petite différence entre les paramètres d'environnement. Cela a été corrigé (voir ticket [#180](https://framagit.org/memo-fresques/memo-viewer/-/issues/180)).
* feat: Lors de l'édition de lien, on peut désormais lire les titres et voir les verso des cartes au moment de la sélection "cause" / "conséquence". Les titres sont téléchargés _à la volée_ : c'est-à-dire que s'ils ne sont pas déjà disponibles dans le CMS, on voit apparaître un point d'interrogation. Mais il suffit de sélectionner cette carte comme une cause ou une conséquence pour que le titre soit téléchargé. La langue affichée ne correspond pas forcémment à la langue de l'utilisateurice (ajustements à faire au moment de gérer l'internationalisation, _cf_ ticket [#176](https://framagit.org/memo-fresques/memo-viewer/-/issues/176)). La difficulté est de ne pas télécharger l'intégralité des données, cela serait trop long. Pour voir la carte, il suffit de passer la souris sur le petit œil (_hover_).
* feat: Lors de l'édition de cartes, on affiche désormais le recto & le verso dans la langue sélectionnée par l'utilisateurice grâce au sélecteur de langue
* Ajout dans la barre de navigation du nom de la Fresque ainsi que de l'icône noir & blanc _Cartes_

## Version 1.6.1. Correction d'un léger bug sur la Fresque Du Climat

La Fresque du Climat définit la langue `zh-CHT` : la page "À propos" pour cette langue était cassée depuis la version 1.6.0 car cette langue est non-standard.
(ticket [#179](https://framagit.org/memo-fresques/memo-viewer/-/issues/179))

## Version 1.6.0. Possibilité de modifier des Fresques dans le CMS et modifications mineures

**CMS** :
* feat: Possibilité de modifier des Fresques : ajout ou suppression de nœuds, déplacement des nœuds (en [documentation](/admin/fresks) − ticket [#152](https://framagit.org/memo-fresques/memo-viewer/-/issues/152)))
* feat: La sauvegarde _en fichiers_ des modifications du mémo contient désormais le numéro de version ainsi que l'url actuelle du mémo
* test/refacto: mutualisation de certains morceaux de code, en particulier le table de "revue" des modifications (page publier) ;
* ux: amélioration de certains labels et ajout de plusieurs explications directement dans le CMS :
    * remplacement du terme sauvegarder par publier
    * explication sur quelle langue est affichée dans le mémo ;
* feat: le format des Fresques est désormais écrit en dur dans le mémo et on vérifie que les Fresques générées ne contiennent pas de bug (un champ manquant par ex.)
* feat: le tableau avec la liste des liens indique désormais les cartes de _départ_ et _d'arrivée_ du lien


**Memo :**
* fix: La couleur des flèches sur la vision Fresque est désormais la _couleur principale_ du site  (ticket [#170](https://framagit.org/memo-fresques/memo-viewer/-/issues/170))
* fix: Correction des traductions pour supprimer la mention de la _Fresque du Climat_ dans la page "Langues" (ticket [#149](https://framagit.org/memo-fresques/memo-viewer/-/issues/149))
* feat: affichage de la date de dernière mise à jour du mémo sur la page "À propos". Cette date permet de s'assurer que le site a bien été recompilé ou non  (ticket [#137](https://framagit.org/memo-fresques/memo-viewer/-/issues/137))
* style: le menu a été amélioré sur mobile pour ne tenir que sur une ligne. Les textes "cartes" et "À propos" ont été remplacés par deux icônes
* style: dans la vision Fresque, le titre de la carte sélectionnée ne contient plus d’ombre et est désormais un peu plus petit ;

v1.6.1: correction du bug pour la Fresque du climat lié à la langue `zh-CHT` (ticket [#179](https://framagit.org/memo-fresques/memo-viewer/-/issues/179))

## Version 1.5.6. Correction d'un bug : les liens supprimés restaient dans la liste.

Le bug [#171](https://framagit.org/memo-fresques/memo-viewer/-/issues/171) était lié à une mauvaise gestion du cache lorsqu'un lien a été supprimé du repository distant. **Attention**, si des modifications existent en local sur ce lien, ces dernières sont effacées silencieusement : faire autrement ?

Petites améliorations de l'expérience utilisateurice sur le CMS :
* Bouton "Effacer toutes les données" changé en "Effacer le cache" (ticket [#175](https://framagit.org/memo-fresques/memo-viewer/-/issues/175))
* Ajout d'un texte sur les pages de modification des cartes ou des liens à propos de la manière dont sont gérées les langues dans le mémo : on affiche par défaut la langue demandée, puis l’anglais, puis n’importe quelle langue. (ticket [#173](https://framagit.org/memo-fresques/memo-viewer/-/issues/173))
* Remplacement de la notion de "Sauvegarde" par la notion de "Publication" et ajout d’un paragraphe sur la page d’accueil pour rappeler que les modifications en local sont faites automatiquement (ticket [#172](https://framagit.org/memo-fresques/memo-viewer/-/issues/172))


## Version 1.5.5. Chargement du dump des modifications

Le fichier ajouté dans la version 1.5.3 peut désormais être chargé dans le mémo. L'objectif était de déboguer [#169](https://framagit.org/memo-fresques/memo-viewer/-/issues/169) mais le bug ne s'est pas reproduit.

## Version 1.5.4. Correction d'un léger bug de mauvais refresh dans les formulaires d'éditions des cartes et des liens

Voir ticket [#167]([#161](https://framagit.org/memo-fresques/memo-viewer/-/issues/167)). Pas de test ajouté.

## Version 1.5.3. Ajout de la possibilité de télécharger les modifications en cas de bug

Pour permettre de corriger les bugs de mise à jour des données sans compromettre notre travail, ajout d'un bouton _Télécharger_ sur la page _Sauvegarder_. Ce bouton télécharge sur notre ordinateur (dossier "Téléchargements" habituel) un dossier qui contient l'intégralité des modifications effectuées.
Ce fichier ne peut pas encore être chargé dans le mémo mais cela devrait arriver dans la prochaine version. Ticket [#168](https://framagit.org/memo-fresques/memo-viewer/-/issues/168)

La barre de navigation affiche désormais la version du mémo (ici 1.5.3) et non plus la version du CMS qui n’est pas incrémentée (version 0.0.0). Ticket [#166](https://framagit.org/memo-fresques/memo-viewer/-/issues/166)


## Version 1.5.2. Gestion des propriétés wikiUrl, youtubeCode et InstagramCode pour les cartes

On peut désormais ajouter _via_ l'interface d'administration les champs `wikiUrl`, `youtubeCode` et `instagramCode` (voir la [documentation](/data/cards)).
Ticket [#163](https://framagit.org/memo-fresques/memo-viewer/-/issues/163)

Motivé par la Fresque des Inégalités.

## Version 1.5.1. Correction d'un bug sur l'interface d'administration

La page "Sauvegarder" de l'interface d'administration ne se chargeait pas sur le version de production (voir bug [#161](https://framagit.org/memo-fresques/memo-viewer/-/issues/161)) et l'intégration continue du mémo n'était pas lancée automatiquement à chaque modification des cartes ou des liens (voir ticket [#165](https://framagit.org/memo-fresques/memo-viewer/-/issues/165))

## Version 1.5.0 CMS Maison

Création d’un [CMS](admin/cms) maison pour modifier les données avec une maîtrise complète du processus en se basant sur l'API Gitlab. L'interface est assez élémentaire pour le moment.

## Version 1.4.7

Correction d'un bug sur l'affichage des Fresques. On affichait également les liens "de la version simplifée". Voir [#156](https://framagit.org/memo-fresques/memo-viewer/-/issues/156) pour la suite.

## Version 1.4.6

Possiblité de dessiner des rectangles à l'arrière d'une Fresque. Voir [sur la documentation](/admin/fresks). Cela était nécessaire pour la Fresque des Frontières Planétaires et l'affichage de zones associées à chaque limite.

## Version 1.4.5

Amélioration de la fonction pour créer des Fresques directement depuis le mémo.

## Version 1.4.4

Lorsque le dossier `public/cards` n’existe pas sur son ordinateur, utiliser les images des cartes disponibles sur le mémo en ligne, à l’url `hostname` définie dans le fichier `settings.json`.
Cela ne charge pas les images SVG (problème de CORS).

## Version 1.4.3

Ajout d’un nouveau champ `memo` dans `settings.json`. Cela permet de spécifier le numéro de la version de memo-viewer compatible avec les données actuelles.

Dans le cas où le repo n’est pas à jour, le script `migrations/migrate.js` permet d’appliquer les éventuelles transformations nécessaires.

```
"memo": {
    "version": "1.4.2"
}
```

Si le champ est absent, on suppose qu’on est en version `1.4.2` ou précédente.

## Version 1.4.0

* Affichage en mosaique et en liste de toutes les cartes du jeu ;
* Une page par carte avec :
    *  la carte (affichée en image vectorielle pour pouvoir sélectionner le texte)
    * les explications de la carte
    * tous les liens vers les différentes cartes
* Affichage optimimé sur mobile avec possibilité de swiper d'une carte à l'autre
* Affichage de la correction des cartes en mode "Fresque". Possible de basculer en mode _quiz_ où les différentes cartes sont cachées (peuvent être montrées en cliquant sur la carte)
* Gestion du multi-langue avec affichage dans la langue de l'utilisateurice dès que possible, sinon dans la langue par défaut (l'anglais), sinon dans une langue où l'info est disponible.<br>
_Cas d'usage_ : la carte est disponible en portuguais mais les explications complètes ne sont disponibles qu'en anglais. On affiche donc les explications en anglais
* Pré-génération de toutes les pages du site web, permet de maintenir une bonne utililisabilité du site même avec Javascript désactivé
* Différentes images compressées pour réduire les transferts de données inutiles
