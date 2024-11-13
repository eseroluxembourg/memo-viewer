# Analyser l'utilisation du mémo

Chaque instance du mémo peut se connecter à un [Matomo](https://fr.matomo.org/), qui est _L'alternative à Google Analytics qui protège vos données et la vie privée de vos clients_.

Matomo est utilisé dans sa configuration _Absence de consentement_ (selon les recommendations de la CNIL) afin de ne mesurer **que** le nombre de visites et d'identifier les pages visitées (et rien de plus).

## Mise en place

Une fois un Matomo à votre disposition (idéalement auto-hébergé), il suffit d’aller indiquer dans le champ `settings.json` les éléments suivants :
```json
{
    ...
    "matomo": {
        "enabled": true, // ou false pour ne pas activer de Matomo
        "host": "<url vers le memo>",
        "siteId": <identifiant du site>
    },
    ...
}
```

## Vie privée et RGPD

En utilisant Matomo, le mémo est dispensé de _Bannière de consentement_ car Matomo n’utilise pas de _cookies tiers_ [voir sur le site de Matomo](https://fr.matomo.org/cookie-consent-banners/) et plus précisément [l’exception de la CNIL](https://fr.matomo.org/faq/how-to/how-do-i-configure-matomo-without-tracking-consent-for-french-visitors-cnil-exemption/)


Pour être conforme à la RGPD il est indispensable que Matomo soit configuré de la sorte :
* Possibilité aux utilisateur·ices de refuser tout suivi
* Anonymer l’adresse IP
* Désactiver le journal des visiteur·euses et des profils
* Permetre aux utilisateurices d’arrêtre le tracking

Par ailleurs :
* donner la possiblité aux personnes de connecter les données collectées
* permettre la suppression des données
* Indiquer quelque part l’utilisation d’un tel tracker

