# ---- Stage 1: Build the Slidev SPA ----
FROM node:lts-alpine AS builder

WORKDIR /app

# Copy
COPY . .

# Build the static SPA into ./dist
RUN npm i && npm run build

# ---- Stage 2: Serve with nginx ----
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (handles SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
