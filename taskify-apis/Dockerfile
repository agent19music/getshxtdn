FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000
CMD ["npm", "start"]
