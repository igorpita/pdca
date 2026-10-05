# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Backend Container
FROM node:20-alpine AS production
WORKDIR /app

# Create directory for persistent database storage
RUN mkdir -p /app/data

COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --only=production

COPY backend/ ./
# Copy frontend production build to backend public folder
COPY --from=frontend-builder /app/frontend/dist ./public

ENV PORT=3001
ENV DATA_DIR=/app/data
EXPOSE 3001

VOLUME ["/app/data"]

CMD ["node", "src/server.js"]
