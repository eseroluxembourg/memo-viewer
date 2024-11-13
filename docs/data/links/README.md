# Les liens entre les cartes

?> Une évolution est envisagée pour avoir des variantes de la même manière que pour les cartes et les Fresques (voir ticket [#211](https://framagit.org/memo-fresques/memo-viewer/-/issues/211))

**Chemins** : `src/assets/_links/<linkid>/<lang>/index.md`

Contenu
```md
---
linkId: "1_4"
fromCardId: 1
toCardId: 4
status: valid
---
Texte d'explication sur les raisons de ce lien
```

Les différents valeurs autorisées pour `status` :
* _valid_
* _optional_
* _invalid_
* _temporary_ : uniquement au sein des Fresques pour afficher un lien qui n'a du sens que parce que toutes les cartes n'ont pas encore été posées (apparaît en pointillés)
* _simplified_ : pour les liens valides uniquement dans la version simplifiée, où on a enlevé des "cartes intermédaires"

