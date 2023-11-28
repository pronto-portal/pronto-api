FROM node:18-alpine
WORKDIR /app
COPY . . 
RUN npm ci && \
npx prisma generate &&\
npm run build

EXPOSE 4000
CMD ["npm", "start"]