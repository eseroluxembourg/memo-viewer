# Memo <%= FRESK_LABEL %>

## Mise en place initiale

- [ ] Créer les liens
- [ ] Créer la page `about`
- [ ] Créer son propre script pour générer les cartes à partir de ses fichiers pdf (voir `scripts/generate_cards.py`)
- [ ] Mettre à jour les valeurs dans README
- [ ] Mettre à jour les valeurs dans `settings.json`
- [ ] Intégration continue : disposer d'un accès `sftp` et renseigner les variables dans la section "Intégration Continue" de Gitlab :
    * `FTP_HOST` : l'url vers le serveur sftp
    * `FTP_PORT` : le port de votre serveur sftp (probableemt 22
    * `FTP_USER` : le nom d'utilisateur
    * `FTP_PASSWORD` : et votre mot de passe
- [ ] Images à renseigner :
    - [ ] `images/icons/card-number-icon.svg`
    - [ ] `logo/logo/<i18ncode>.png`
    - [ ] `previews/<i18noce.png`
    - `images/unknown-card.png`

Ce projet contient toutes les données pour générer le mémo de la **<%= FRESK_LABEL %>** à partir du logiciel [memo viewer](https://framagit.org/memo-fresques/memo-viewer).

## Développement

* Récupérer le code source de ce repository :
```
git clone https://framagit.org/memo-fresques/<%= FRESK_SLUG %>
```
* Récupérer le code source de memo-viewer et le rendre accessible dans un sous-dossier `memo-viewer`
    * Solution 1 : cloner le repo en local
    ```
    cd fresque-du-numerique
    git clone https://framagit.org/memo-fresques/memo-viewer.git memo-viewer
    ```
    * Solution 2 : créer un lien symbolique vers `memo-viewer`
    ```
    ln -s <path to memo-viewer> <path-to-your-fresk>/memo-viewer
    ```

## Générer les cartes et les images

Utiliser le script `scripts/generate_cards.py` pour générer toutes les images des cartes à partir de fichiers pdfs (un par langue). Les images sont volontairement exclues de ce repository Git afin de l'alléger.
Les pdf avec les différentes cartes peuvent être obtenues dans "l'espace animateur·ice" de l'association.

1. Créer un dossier `pdf-cards` et y ajouter le fichier fr-FR.pdf avec les cartes pdf français au complet.
2. Appeler le script `python3 scripts/generate_cards.py pdf-cards`

