FROM node:18-alpine

WORKDIR /app

# 1. Copier les fichiers nécessaires à l'installation
COPY package*.json ./

# 2. Copier tout le code maintenant (inclut prisma/, src/, etc.)
COPY . .

# 3. Installer les dépendances (déclenchera aussi le postinstall avec Prisma)
RUN npm install

# 4. (Optionnel) Forcer la génération Prisma
RUN npx prisma generate

# 5. Compiler le TypeScript
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/index.js"]


