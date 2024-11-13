# Les illustrations

**Changelog** :
* v1.7.0 Les chemins ont évolué dans la version 1.7.0 avec l'ajout d'un niveau d'arborescence `variantId`

**Chemins** : `public/cards/<variantId>/<lang>/(150|250|450|600|default|svg)/.(back|front).(webp|png|jpg|svg)`

Pour fonctionner, le mémo a besoin de chaque cartes aux formats suivants :
* en `webp` de tailles `125`, `250`, `450`, `600`
* en `png` pour le back, en `jpg` pour le front
* en `svg`
Toutes ces images sont regroupées dans un dossier `cards` puis dans des sous-dossiers à partir de l’architecture suivante.

?> Besoin d'aide pour générer des illustrations ? Voir la page [sur la documentation](/admin/cards)

```
cards/
  v9.0/
    fr-FR/
        150/
            1-front.webp
            1-back.webp
            ....
        250/
            1-front.webp
            1-back.webp
            ...
        450/
            1-front.webp
            1-back.webp
            ...
        600/
            1-front.webp
            1-back.webp
            ...
        default/
            1-front.jpg
            1-back.svg
            ...
        svg/
            1-front.svg
            1-back.svg
            ...
    ar-AR/
    ...
```
