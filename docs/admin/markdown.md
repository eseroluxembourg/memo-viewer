# Le markdown

Le markdown est une façon très commune d'écrire du texte pour le web. En plaçant des `*`, `#`, `_` au bon endroit, on indique quels mots on souhaite mettre en gras, en italique, etc. Les possibilités sont vraiment très grandes.

C'est de cette manière que l'essentiel des textes (explications) sont mis en forme dans le mémo.

Le Markdown est utilisé très largement, on peut l'utiliser sur Mattermost, Slack ou Teams par exemple. Et même ce site [memo.fresque.earth](https://memo.fresque.earth) est écrit en Markdown. L'avantage de cette manière d’écrire est qu'elle ne complique pas trop la lecture.
De nombreuses ressources peuvent être trouvées en ligne.

Dans l'interface d'administration, il y a un bouton « Prévisualiser » qui permet de voir à quoi ressemblera le texte et donc s'il y a une erreur de mise en forme.

## Éléments de base

### Italique, gras, liens

Pour écrire du **texte en gras** on va écrire `**texte en gras**` (noter l'absence d'espaces entre les `**` et les mots). Pour de _l'italique_, ça marche `_de cette manière_`. On peut également ajouter des liens hypertextes en écrivant `[le texte à afficher](https://memo.fresque.earth)`

### Listes

Si on veut faire des listes :
```md
* ma liste à puces
* avec un deuxième élément
```
Ou bien pour une liste numérotée :
```md
1. Premièrement
2. Deuxièmement
```

### Des notes de bas de page

?> L'outil utilisé est [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote), s'y référer pour une documentation complète et exhaustive


Pour ajouter des notes de bas de page, il ajouter `[^qqch]` où `qqch` peut-être remplacé par n'importe quoi, tant que c'est unique  (`[^10]` ou `[^monlivre]` fonctionnent parfaitement par exemple). Ensuite, il faut indiquer **ap

```
Blabla et là il faut le référencer[^1] Et encore un autre[^longnote]

[^1]: Et là la note de bas de page

[^longnote]: Et ici une en plusieurs lignes

    Les lignes supplémentaires sont indentées pour mettre en évidence qu'elles apparaissent à la note de bas de page.
```

## Usage avancé

?> Le rendu markdown est techniquement réalisé avec [markdown-it](https://github.com/markdown-it/markdown-it)

### Photos et images

Il est techniquement faisable d'ajouter des images en Markdown, néanmoins, l'interface d'administration ne permet pas d'ajouter des photos. À la date actuelle (décembre 2023) il est donc nécessaire d’uploader les images à la main dans le projet Gitlab (voir ticket [#202](https://framagit.org/memo-fresques/memo-viewer/-/issues/202)).

### HTML et classes CSS

Je ne sais pas si c’est géré ?