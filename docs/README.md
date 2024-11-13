# Mémo de la Fresque

?> _Être au courant des dernières fonctionnalités sur Télégram : https://t.me/+EB9mGj24fE5kNDdk_


## Historique

Le mémo est le site internet pour donner toutes les clés à vos animateur·ices et les aider dans les animations de leurs Fresques.

L’outil a été créé au printemps 2020 par et pour des animateur·ices de la [Fresque du Climat](https://fresqueduclimat.org/), il  met à disposition la correction lot par lot de la Fresque avec des explications détaillées sur chaque cartes et les différents liens entre elles. Toujours dans la poche, l’interface du mémo pensée pour le smartphone permet de jeter un œil à la correction au cours d’une animation.

**Depuis avril 2020, ce sont plusieurs centaines d'animateur·ices de la Fresque du Climat qui utilisent le mémo quotidiennement.**

## Logiciel libre, un bien commun

Développé en logiciel libre sous licence [AGPLv3](https://framagit.org/memo-fresques/memo-viewer/-/blob/main/LICENSE), le mémo peut être librement installé et modifié pour s'adapter aux différentes Fresques (dans les limites de la licence). Le code source est accessible à tous·tes et ouvert aux contributions : [code source sur Framagit](https://framagit.org/memo-fresques/memo-viewer).

La philosophie du mémo est de fournir un logiciel unique déclinable à toutes les Fresques, de répondre par un outil unique et commun aux besoins de toutes les Fresques. Cela implique d’importantes contraintes au niveau du développement :
* faire en sorte que les nouvelles fonctionnalités soient utilisées par différentes Fresques ;
* faire en sorte que les différents mémos puissent utiliser la dernière version du logiciel automatiquement, sans manipulation spécifique.

**Liste des Fresques qui utilisent ou expériment le mémo** :

| Fresque | Url |
| -------|------|
| Fresque du Climat | https://memo.climatefresk.org
| Fresque des Frontières Planétaires | https://frontieresplanetaires.memo.fresque.earth
| Fresque des Inégalités | https://inegalites.memo.fresque.earth
| Fresque du Numérique  | https://numerique.memo.fresque.earth
| Fresque Océane  | 🔒 https://oceane.memo.fresque.earth (mot de passe requis)
| Fresque de l'Alimentation (en cours) | 🔒 https://alimentation.memo.fresque.earth (mot de passe requis)
| Fresque de la Clinique Vétérinaire (en cours) | 🔒 https://clinique-veterinaire.memo.fresque.earth (mot de passe requis)

👉 _Vous souhaitez déployer le mémo pour votre Fresque ? Je peux vous accompagner : dev@marc-antoinea.fr_


## Au service des Fresques

L'outil est pensé pour que les Fresques et les animateur·ices s'en emparent et l'adaptent pour répondre à leur besoin. Chaque Fresque reste propriétaire de l'intégralité des données utilisées dans le mémo. Ses dernières sont dans un format structuré et lisible, pour permettre sa réutilisation au sein d'autres outils.

Aussi bien la structure qui porte la Fresque que les animateurices ont accès à une interface d'administration pour simplement mettre à jour le mémo ou proposer des améliorations (explications complémentaires des cartes notamment).


## Résilient, simple et sobre

Tout le développement du mémo est orienté vers la résilience, la simplicité et la sobriété.

* La technologie utilisée [VueJS](https://vuejs.org/) est très répandue parmi les développeur·euses web : il y aura toujours des développeur·eu·ses dans votre communauté capable de développer une nouvelle fonctionnalité ;
* Une fois compilé, le mémo est un ensemble de fichiers HTML, Javascript et CSS. Il suffit de mettre ces fichiers sur un serveur et tout fonctionne ([en savoir plus sur la JamStack](https://jamstack.org/))
    * Pas besoin d’installer la bonne version de PHP, de NodeJS ou de configurer une base de données ;
    * Pas besoin d'avoir un serveur puissant et fortemment consommateur en ressources ;
    * On ne peut pas faire un déploiement plus simple, c’est accessible à n'importe quel·le développeur·euse ;
    * Les soucis de maintenance ou risques de sécurité sont fortement diminués ;
* Toutes les images sont compressées pour minimiser les transferts de données et donc la consommation énergétique du site (et donc son impact carbone) (en [savoir plus](/ecoconception))
* Tout le code source et l'intégralité des scripts et outils d'administrations sont accessibles en ligne et documentés
* Toutes les données de la Fresque (explications, traductions, images) sont sauvegardées dans des fichiers textes simple et [documentés](/data/). À tout moment ces données peuvent être importées dans un autre logiciel.

