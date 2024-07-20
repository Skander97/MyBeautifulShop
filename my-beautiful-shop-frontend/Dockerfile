# Dockerfile pour le frontend

# Utilisez une image de node comme image de base
FROM node:16

# Définissez le répertoire de travail
WORKDIR /app

# Copiez le fichier package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste des fichiers de l'application
COPY . .

# Construisez l'application
RUN npm run build

# Utilisez une image de serveur web pour servir l'application
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Exposez le port 80
EXPOSE 80

# Commande pour lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
