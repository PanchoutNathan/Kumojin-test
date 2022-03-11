##Application de gestion d’événements ##

L’objectif est d’avoir une application basique de gestion des événements.



Un événement est caractérisé par son nom (32 caractères maximum), sa description et ses dates de début et de fin. Attention, les événements peuvent avoir lieu n’importe où dans le monde, n’oublie pas de prendre en compte la timezone.



### Le back-end ###
Une API REST qui retourne du JSON. Il doit gérer les opérations suivantes :

- Créer un événement
- Lister les événements


### Le front-end doit permettre de : ###

- Créer un événement
- Lister les événements (optionnel)


### Optionnel: une fois cette application terminée prépare son déploiement en : ###

- Écrivant les Dockerfile qui construisent les applications front-end et back-end 
- Écrivant les GitHub Action pour tester, builder et déployer dans Kubernetes
- Écrivant les manifests Kubernetes pour déployer les 2 applications avec un Ingress, on part du principe que le cluster possède un Nginx Ingress Controller


Considère que cette application est la base d’un nouveau produit et qu’il faut qu’elle soit codée dans les règles de l’art. Tu peux bien entendu faire des compromis sur l’implémentation mais sois prêt à en discuter et à les justifier.



Quand tu as terminé, tu peux juste nous donner l'adresse de ton repository GitHub (un seul repository avec le front et le back), on y jettera un coup d'œil.



Si tu as besoin d'autres informations, n'hésite pas !