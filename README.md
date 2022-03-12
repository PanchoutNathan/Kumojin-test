# Nathan Kumojin-Test

## Features ##

Le front se présente sous forme d'un calendrier. Pour ajouter un événement, il suffit de cliquer
sur le calendrier ou de sélectionner une plage horaire en cliquant puis glissant.

Une modale va alors s'ouvrir avec le début et la fin de préconfiguré.

Vous pouvez aussi cliquer sur un événement pour le modifier.

Comme les timezones étaient importantes, j'ai mis quelques boutons pour sélectionner une timezone.

#### Responsive ####
Pour le responsive, j'ai fait en sorte que le calendrier se mette en mode "day" pour que ça puisse être utilisable.


## Stack ##
- Front: React + TS. Pour le projet, il y avait une option qui était de lister les événements. Pour
  cela j'ai utilisé Fullcalendar pour le présenter sous forme de calendrier. Je n'ai pas eu besoin d'utiliser un routeur car
  j'ai fait tout dans la même page.


- Back: NestJS avec TypeORM


- Database : Postgres

J'ai mis environ 8h.


## Docker ## 

J'ai tout intégré dans Docker (React + Nest + Postgres, en mode développement). Comme ça vous n'avez qu'un `docker-compose up` à faire.
La création des databases est aussi effectuée à l'aide du `init.sql`

- Le front se trouve sur le port 3001.
- Le back se trouve sur le port 3000.

Puis rendez-vous sur `http://localhost:3001/` pour accéder au front.

### Amélioration du Docker ###
Je pense pas que ce soit l'objectif non plus, mais au cas ou je présente les améliorations que j'aurais pu faire :
- Ajouter des variables d'environnements pour setup la connexion à la DB avec un docker.env. Comme ça permet
  d'avoir en local une configuration différente. Car évidemment, les builds de l'app react / Nest sont super longs dans le docker. (Sur Mac)

### Remarque sur le mode production ### 
Je n'ai pas écrit de Dockerfile / docker-compose pour un mode production. Je pense que l'objectif était de savoir si je pouvais
utiliser Docker et j'ai déjà fait une stack Docker pour le développement.

Cependant je peux vous décrire comme je fais pour déployer mon projet personnel qui est sur la même stack (sauf la database qui est sur du MongoDB)
, tout est automatisé :

- Je build mon react en mode production
- Je copie tout le contenu du dossier du build dans le dossier public du projet NestJS (Nest peut évidemment rendre du static)
- Pour finir je lance mon nest en mode production.

## e2e Testing ## 
J'ai écrit des tests e2e avec une base de test. Je préfère cette approche car comme ça on est au plus prêt de l'utilisateur final.
Ça rassemble les tests unitaires + intégrations.
Bien évidemment, pour une approche TDD, on ne procède pas comme ça, mais en commençant avec des mocks des services, etc.

J'ai testé les routes suivantes :

GET /api/calendar-events
POST /api/calendar-events
PUT /api/calendar-events/:id

Pour lancer les tests, à l'aide de votre terminal, rendez-vous à la racine du projet `nest-back`. Puis tapez la commande :
`npm run test:e2e`
