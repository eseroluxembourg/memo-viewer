# Polices de caractères

Pour pouvoir afficher correctement les cartes sur le mémo, il est impératif d'installer la police de caractère adéquate.

## Trouver les polices

> Pour ne pas du tout s'embêter, il est aussi possible de récupérer directement les polices de caractères embarquées dans le fichier pdf. Il faut par contre bien noter que ces polices sont partielles car seuls les caractères présents dans le pdf sont intégrés à la police. Par exemple, si la lettre B n’est pas présente dans le pdf, alors elle ne sera pas non plus présente dans la bonne police.
>
> **Comment faire** ? Sur Linux, ouvrir Fontforge qui propose directement d'ouvrir des polices depuis un fichier pdf.

Pour savoir quelles sont les polices utilisées, il est possible d’utiliser Inkscape en ouvrant les fichiers PDF ou bien passer par le service web https://pdfux.com/inspect-pdf/. Ou bien, si les cartes ont déjà été converties en fichier _vectoriel_, regarder quelles polices y sont utilisées.

## Les rendre disponible sur le mémo

Pour rendre les polices disponibles sur le mémo, il est possible de passer par _Google Font_ (si la police y est référencée) mais il est plutôt conseillé d’installer directement la police au sein du mémo.

Pour cela, il faut :
1. Télécharger la police sur son ordinateur
2. Potentiellement la convertir en plusieurs formats, idéalement aux formats `otf`, `ttf` et `woff`. Pour la convertion on peut utiliser ce [script là](ttps://framagit.org/Marc-AntoineA/files-manipulator/-/tree/main/fonts-manipulator?ref_type=heads)
3. Déplacer les fichiers dans le dossier `assets/fonts` (éventuellement créer des sous-dossiers)
4. Modifier le fichier `assets/styles/local.scss` avec les définitons `font-face` nécessaires :
```css
@font-face {
    font-family: Montserrat-Regular;
    src: local('Montserrat-Regular'), url('/fonts/Montserrat-Regular.ttf') format('truetype'), url('/fonts/Montserrat-Regular.otf') format('otf'),
        url('/fonts/Montserrat-Regular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
```
