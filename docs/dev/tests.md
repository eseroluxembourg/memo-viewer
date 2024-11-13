# Tests

Plusieurs types de tests sont disponibles pour le mémo.

## Tests sur la structure de données

Les différents fichiers de données (cartes, fresques, variantes, etc.) doivent vérifier des schémas spécifiques. Il existe un test pour vérifier que ses propres données sont ok, voir le fichier `validation.test.js`.

Pour le lancer depuis son projet "données".
```
npm run test
```

## Tests unitaires

Il y a également quelques tests unitaires sur les fonctions utilitaires JavaScript. Actuellement essentiellement pour la partie administration. Ces tests sont accessibles dans les dossiers `tests` et `admin/tests`.

Pour lancer ces tests :
```
npm run test
```

## Tests d'intégration du mémo

L'idée est de créer un mémo avec des données fictives qui nous permettent de lister une grande partie (dans l'idéale toute) des fonctionnalités présentes dans le mémo. Ces données sont générées à partir du générateur `yeoman`. Ensuite, ce mémo fictif est executé sur différents navigateurs et son comportement est scruté de près : "est-ce que le bouton changement de langues fonctionne bien ?", "est-ce que l'image est bien chargée ?", etc.

L'infrastructure de tests d'intégration a été mise en place en sept. 2024 et n'était alors pas du tout exhaustive.

### Les données de test

Ces données peuvent être générées en utilisant le générateur `yeoman` en répondant "yes" à la question associée. L'idée, à terme, est que ces données permettent d'avoir une bonne représentation de tout ce qu’il estp ossible de faire avec le mémo.

### Comment ajouter un test

Pour ajouter un test, il est important de les lancer en local. Pour cela, il faut travailler sur les données fictives (et donc les générer à partir du projet `yeoman`).

Le lancement en local s'effectue en ouvrant `cypress` avec la commande

```
npm run cy:open
```

Les tests d'intégration sont à ajouter directement dans des fichiers `cypress/e2e/xxx.c.y.ts`.


## Intégration continue

L'intégralité de ces tests sont désormais exécutés à chaque commit à travers deux jobs :
* un job génère les données fictives, lance les tests unitaires et compile le mémo. Cela permet de se rendre compte que *a minima*, cela compile. Dans le cas où ça échoue, c'est soit parce qu'il y a un bug dans le mémo, soit parce que le générateur doit être mis à jour ;
* un job génère les données fictives et lance les tests d'intégration avec `cypress` ;