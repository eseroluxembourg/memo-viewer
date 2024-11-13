# L’interface d’administration, techniquement

!> Cette page s'adresse à des développeur·euses ou administrateur·ices systèmes. Les explications supposent une aisance avec git, Gitlab & co.

On suppose que le fonctionnement côté « utilisateur·ice » est connu, si ce n'est pas le cas, voici le [lien vers la documentation](/admin/cms).

## Grands principes du CMS

* L'interface d'administration est une sur-couche pour modifier le repository des données grâce à [l'API REST](https://docs.gitlab.com/ee/api/rest/) de Gitlab. Les différents fichiers sont tous téléchargés par l'API.
* Lorsqu'un·e utilisateur publie des modifications, il réalise un commit sur la branche principale dont le message de commit est le texte qu'il a renseigné.
* La recompilation du mémo suite à des modifications est gérée par l'intégration continue côté Gitlab.
* Les requêtes à l'API sont mises en cache (localstorage du navigateur) ;
* Si un nouveau commit est réalisé, seuls les fichiers modifiés sont invalidés

## Génération du token

L'utilisation d'un token a été mise en place dans un premier temps pour éviter de devoir implémenter une interface Gitlab (peut-être à faire un jour?). Un autre intérêt est de pouvoir donner des droits de modifications à certaines personnes sans que ces dernières n’aient un compte Gitlab (voire ne sachent que ça existe).

Il y a deux manières de générer des tokens :
* Les tokens personnels : utile pour vous, notamment si vous n'êtes pas maintainer du projet. Les commits sont _faits en votre nom_.
* Les tokens par projet : seul·les les administrateur·ices peuvent les générer. Les commits sont faits _au nom du token_.

Dans tous les cas, il faut donner les droits de _developer_ et d'_api_.

**Quelques points** :
* Vigilance sur le choix de la date d’expiration : ce n'est pas forcément souhaitable d'avoir des tokens en circulation ;
* Seul·es les administrateur·ices du projet Gitlab peuvent créer un token de projet ;
* Ne pas donner plus de droits que nécessaires et en particulier **vraiment** se contenter des droits de _developer_
* Les commits étant réalisés sur la branche _main_, il faut que sa configuration permette aux _developer_ de commiter
* Bien protéger la branche principale (interdire les `force push` et la suppression de la branche notamment)
* Bonne idée de générer des tokens différents par contributeur·ice pour suivre les différentes contributions


