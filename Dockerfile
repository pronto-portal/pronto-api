FROM node:18
WORKDIR /app
COPY . . 
RUN npm ci
RUN npx prisma generate
RUN npm run build
EXPOSE 4000
ENTRYPOINT [ "node", "dist/index.js" ]