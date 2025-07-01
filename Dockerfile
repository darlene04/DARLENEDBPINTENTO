# Imagen base de Node.js
FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de desarrollo de Vite
EXPOSE 3000

# Comando por defecto (modo desarrollo)
CMD ["npm", "run", "dev"]
