FROM node:18-alpine
WORKDIR /app
COPY . . 

RUN apk --no-cache add curl && \ 
    npm ci && \
    npx prisma generate 
    
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm run build && \
    chmod 755 /app/healthcheck.sh

EXPOSE 4000
CMD ["npm", "start"]