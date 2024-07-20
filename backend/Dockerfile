# Utilisez une image de base officielle de Python
FROM python:3.8-slim

# Définissez le répertoire de travail
WORKDIR /app

# Copiez les fichiers de l'application dans le conteneur
COPY . /app

# Installez les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Exposez le port utilisé par l'application Flask
EXPOSE 5000

# Commande pour lancer l'application
CMD ["python", "app.py"]
