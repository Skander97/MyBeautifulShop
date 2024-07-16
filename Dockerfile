# Dockerfile

# Utiliser l'image Python officielle
FROM python:3.8-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier requirements.txt dans le conteneur
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le contenu du dossier backend/app dans le conteneur
COPY backend/app /app

# Exposer le port 5000
EXPOSE 5000

# Définir la commande par défaut pour exécuter l'application Flask
CMD ["python", "app.py"]
