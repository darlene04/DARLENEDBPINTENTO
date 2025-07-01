# Usar una imagen base de Node.js
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo package.json e instalar las dependencias
COPY package*.json ./

RUN npm install

# Copiar el código fuente de la aplicación
COPY . .

# Exponer el puerto 3000
EXPOSE 5173

# Comando para ejecutar la aplicación
CMD ["node", "app.js"]