FROM node:18-alpine
WORKDIR /app
COPY . . 
ENV NODE_ENV=production
RUN apk --no-cache add curl && \ 
    npm ci && \
    npx prisma generate && \
    npm run build && \
    chmod 755 /app/healthcheck.sh

EXPOSE 4000
CMD ["npm", "start"]