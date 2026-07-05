# Install dependencies for both backend and frontend
install:
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

# Start development servers for backend and frontend
dev:
	./scripts/dev.sh

# Build the frontend for production
build:
	cd frontend && npm run build

# Run tests for both backend and frontend
test:
	cd backend && pytest
	cd frontend && npm test

# Start all services using Docker Compose
docker-up:
	docker-compose up --build -d

# Stop all services started by Docker Compose
docker-down:
	docker-compose down

# Clean up generated files and Docker artifacts
clean:
	rm -rf backend/__pycache__
	rm -rf frontend/node_modules
	rm -rf frontend/dist
	docker-compose down --volumes --remove-orphans