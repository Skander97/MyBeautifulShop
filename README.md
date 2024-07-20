# My Beautiful Shop
## Description
"My Beautiful Shop" est une application web conçue pour gérer et analyser les opérations de commerce électronique. Elle comprend un serveur backend construit avec Flask, une application frontend construite avec React, et utilise MongoDB comme base de données.

### Fonctionnalités
#### Tableau de Bord Financier :

* Suivi des flux financiers
* Gestion des factures et des paiements
* Détection des anomalies financières
* Assurer l'intégrité des données comptables
#### Tableau de Bord des Ventes :

* Visualiser les ventes par produit, catégorie, région et client
* Suivi des produits les plus vendus
* Visualisation des indicateurs clés de performance (KPIs)
#### Tableau de Bord Analytique :

* Génération de rapports de performance
* Analyse des tendances à long terme
* Identification des secteurs à renforcer, réorienter ou abandonner
### Prérequis
* Docker
* Docker Compose
### Démarrage
#### Cloner le dépôt
```sh
git clone <url-du-repository>
cd MyBeautifulShop
```
#### Structure des Dossiers
```sh
MyBeautifulShop/
│
├── backend/
│   ├── app/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
│
├── data/
│
└── docker-compose.yml
```
#### Construire et Démarrer avec Docker Compose
##### 1- Construire et démarrer les conteneurs :

```sh
docker-compose up --build
```
##### 2- Accéder à l'application :

* Frontend : http://localhost:3001
* API Backend : http://localhost:5000
#### Configuration du Backend
Le backend est construit avec Flask et fournit divers endpoints pour gérer et récupérer des données.

* Configuration :
Le serveur backend démarre automatiquement et se connecte à l'instance MongoDB spécifiée dans le fichier docker-compose.yml.
#### Configuration du Frontend
Le frontend est construit avec React et fournit une interface utilisateur pour interagir avec l'API backend.

* Configuration :
Le serveur frontend démarre automatiquement et est accessible à http://localhost:3001.
#### Variables d'Environnement
Assurez-vous que les variables d'environnement suivantes sont correctement définies dans le fichier docker-compose.yml :

```yaml
services:
  backend:
    environment:
      - MONGO_URI=mongodb://mongo:27017/my_beautiful_shop
```
### Endpoints API
#### Finance
* Obtenir les commandes : GET /finance/orders
* Obtenir les paiements : GET /finance/payments
* Obtenir les paiements en attente : GET /finance/outstanding
* Obtenir les paiements par mois : GET /finance/payments-by-month
* Obtenir les paiements par année : GET /finance/payments-by-year
* Détecter les anomalies : GET /finance/anomalies
* Vérifier l'intégrité des données : GET /finance/integrity-check
#### Ventes
* Obtenir les ventes : GET /ventes/
* Obtenir les indicateurs de vente : GET /ventes/indicators
* Fournir des données de vente : POST /ventes/data
* Obtenir les ventes par produit : GET /ventes/sales-by-product
* Obtenir les produits les plus vendus : GET /ventes/top-products
* Obtenir les ventes par client : GET /ventes/sales-by-customer
* Obtenir les ventes par catégorie : GET /ventes/sales-by-category
* Obtenir les ventes par état : GET /ventes/sales-by-state
* Obtenir les ventes par région : GET /ventes/sales-by-region
* Obtenir les KPIs des ventes : GET /ventes/kpis
#### Analytique
* Générer des rapports : GET /analytics/generate-reports
* Analyser les tendances : GET /analytics/analyze-trends
* Identifier les secteurs : GET /analytics/identify-areas
* Classification des vendeurs : GET /analytics/classify-vendors

### Accès sales
* Utilisateur : sales
* Mot de passe : sales_pass
### Accès finance
* Utilisateur : finance
* Mot de passe : finance_pass
### Accès analytics
* Utilisateur : analytics
* Mot de passe : analytics_pass

## Contribuer
Si vous souhaitez contribuer à ce projet, veuillez cloner le dépôt et utiliser une branche de fonctionnalité. Les pull requests sont les bienvenues.