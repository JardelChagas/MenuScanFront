# Etapa 1: build da aplicação
FROM node:22 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa 2: servir o build estaticamente com Nginx
FROM nginx:stable-alpine

# Copia o build gerado para o diretório padrão do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta padrão do Nginx
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]

