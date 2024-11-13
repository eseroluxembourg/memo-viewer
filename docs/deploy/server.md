# Serveur

Le mémo et l'interface d'administration sont pré-générées lors de la phase de compilation (_build_). Ces fichiers ont simplement besoin d'être servis par un serveur web quelconque :
* besoin d’un accès FTP (ou SSH) au dossier où placer les fichiers (utilisé par l’intégration continue) ;
* besoin d’un serveur HTTP type Apache2 ou Nginx

!> Il est important d'avoir des accès dédiés et restreints pour le mémo. Les identifiants présents sur Gitlab sont stockés en clair, accessible à tous·tes les administrateurices du projet.

Une fois à votre disposition, vous devez renseigner les identifiants d'accès directement dans la rubrique "Settings > CI/CD > Variables" :
* Si vous disposez d'un accès FTP au serveur :
  * `FTP_PORT` : _a priori_ `22`
  * `FTP_HOST`
  * `FTP_USER`
  * `FTP_PASSWORD`
* Si vous disposez d'un accès SSH au serveur :
  * `PROD_PORT`
  * `PROD_SSH_KEY` : une **clé privée** qui a les autorisations pour se connecter au serveur ;
  * `PROD_USER` : le nom de l'utilisateurice
  * `PROD_HOSTNAME` : une url pour se connecter au serveur


## Sur hébergement web classique

Dans le cadre d'un hébergement web classique, l'hébergeur ne laisse pas la main sur le serveur en lui même mais à la place fournit directement un accès FTP. Suivant l'offre commerciale, il peut y avoir plusieurs accès FTP possible.

Sous OVH par exemple, les identifiants ressemblent à :
* `FTP_HOST` : `ftp.clusterXXX.hosting.ovh.net`
* `FTP_PORT` : `22`

## Sur machine virtuelle dédiée

C'est l'installation qui est préconisée, vous devez simplement disposer d'une machine virtuelle Linux avec un accès SSH et les accès root.

Pré-requis : ajouter une entrée DNS pour rediriger le nom de domaine souhaité vers votre serveur.

!> Actuellement, la protection https du nom de domaine est à gérer de manière adhoc et préalable, avec certbot par exemple.

Par ailleurs, il est également nécessaire de configurer le serveur web. Il s'agit probablement d'un serveur Apache. Dans ce cas, se référer à ce qui est écrit [dans cette section](deploy/server?id=apache2).

### Installation avec Ansible

Un script Ansible, présent dans le dossier `ansible-playbooks` permet de faire automatiquement les différentes étapes listées dans la section suivante (à lire pour avoir une idée de ces étapes).

1. Installer Ansible sur votre machine :
```terminal
pip install ansible
```
2. Ouvrir le fichier `_ansible/vars.yml`  et potentiellement ajuster certaines valeurs, en particulier si vous voulez ou non protéger votre mémo par un mot de passe, et avec lequel.
3. Créer un fichier `_ansible/hosts` pour permettre à Ansible de savoir sur quel serveur déployer :
```
[all]
<url serveur>:<port ssh> ansible_user=<utilisateur pour se connecter>
```
Ce fichier est ignoré par git.
4. Lancer la commande npm suivante, depuis la racine de votre projet données.
```terminal
npm run ansible:server
```
Cette commande vous demandera au préalable d'indiquer le mot de passe superutilisateur sur la machine hôte.


### Installation à la main

Pour disposer d'un serveur avec Nginx nous avons besoin de :
* Créer un utilisateur·ice avec accès SSH
* Configurer le serveur en ajoutant un fichier de configuration nginx
* Générer une clé ssh pour permettre à Framagit de se connecter au serveur ;
* Créer le fichier de mot de passe et mettre à jour la configuration nginx au besoin

#### La configuration serveur

L'enjeu de la configuration est essentiellement de faire en sorte que l'utilisateurice puisse être redirigé vers le mémo quelque soit l'url qu'iel a renseigné. Si l'url n'existe pas, il est de la responsabilité de l'application d'afficher une `Erreur 404` (en l'occurence, de rediriger vers la page d'accueil).

Comme le mémo est en grande partie `pré-générée`, il existe une architecture de dossiers/fichiers associés à une grande partie des urls, par ex.

```txt
fr-FR
    /card/
        2/index.html # Fichier index.html associée à la page /fr-FR/card/2
        22/index.html # Fichier index.html associée à la page /fr-FR/card/22
        ...
```

Mais certaines urls n'ont pas de fichier html associé (notamment celles qui n'existent vraiment pas). Il faut donc dire au serveur HTTP quoi faire.


##### Nginx

Dans le cadre de [Nginx](https://nginx.org/) on utilise la directive `try_files` qui permet d’indiquer quoi faire. Dans notre cas `try_files $uri $uri/ /index.html;` signifie : Lorsque tu reçois une $uri (ex. `/fr-FR/card/2`), (1) regarder si le fichier `/fr-FR/card/2.html` existe, sinon (2) `/fr-FR/card/2/index.html`, sinon (3) renvoyer le fichier `/index.html`
(C'est grâce à la la directive `index` qu'on peut ne pas indiquer l'extension `.html`)

Voici un exemple complet

```txt
location / {

    # Path to source
    alias /var/www/<your project>/www/;

    # Default indexes and catch-all
    index index.html index.php;
    try_files $uri $uri/ $uri.html /index.html;
    default_type 'text/html';

    location ~ \.(js|css|jpe?j|png|svg|webp) {
        try_files $uri $uri/;
    }

    # Prevent useless logs
    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }
    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }

    # Deny access to hidden files and directories
    location ~ ^/(.+/|)\.(?!well-known\/) {
        deny all;
    }
}
```

##### Apache2

On peut faire la même chose avec Apache2 en utilisant les `RewriteMod`.

Une manière de faire est de créer un `.htaccess` à la racine du projet avec ces informations :
```txt
RewriteEngine On

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

Pour que ce fichier soit uploadé sur le serveur, il peut être créé à la racine du projet Gitlab "données". Il sera automatiquement inclus au projet du mémo.

Ressources :
* https://stackoverflow.com/questions/44296128/apache-try-files-analog
* https://stackoverflow.com/questions/68454684/how-to-redirect-404-errors-and-403-to-index-html-with-a-200-response

(en production pour la Fresque du Climat)


#### Authentification avec Nginx

Il peut être souhaitable de limiter l'accès au mémo à certain·es utilisateur·ices uniquement.

Une manière robuste de le faire est d'ajouter une étape d'authentification par mot de passe côté serveur.

**Note** : Sur une configuration _Apache2_, il est possible d'utiliser les `.htaccess`.

Documentation NGINX: [Restricting Access with HTTP Basic Authentication](https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-http-basic-authentication/)

1. Créer une paire utilisateur / mot de passe avec `htpasswd` et l'enregistrer dans un fichier
```terminal
sudo htpasswd -c <CHEMIN FICHIER> <NOM UTILISATEUR>
```

2. Ajouter ces lignes dans la configuration NGINX pour la les urls à protéger :
```nginx
location / {
    auth_basic "Ce texte sera affiché à l'utilisateurice";
    auth_basic_user_file <CHEMIN VERS FICHIER MOT DE PASSE>;
}
```

**Note** : si le serveur NGINX est au sein d'un serveur Yunohost, penser à désactiver `ssowat` (lien vers [le forum de Yunohost](https://forum.yunohost.org/t/nginx-basic-auth-stopped-working/23262/3)) :
* Ouvrir  `/etc/ssowat/conf.json`
* Changer les paramètres `use_remote_user_var_in_nginx_conf` et `auth_header` à `false` pour le site concerné.

