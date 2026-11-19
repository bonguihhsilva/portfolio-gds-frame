FROM node:24.22.1-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Lidos no build porque entram em rewrites e no bundle do navegador.
ARG BACKEND_URL=http://backend:5000
ARG NEXT_PUBLIC_WHATSAPP_NUMBER
ENV BACKEND_URL=$BACKEND_URL NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER
RUN npm run build

FROM node:24.22.1-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/content ./content
USER node
EXPOSE 3000
CMD ["node", "server.js"]
