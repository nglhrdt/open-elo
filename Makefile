.PHONY: dev dev-api dev-client install-all help

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev          - Run both API and client in development mode"
	@echo "  make dev-api      - Run only the API server"
	@echo "  make dev-client   - Run only the client"
	@echo "  make install-all  - Install dependencies for both API and client"

# Run both services concurrently
dev:
	@echo "Starting API and Client..."
	@(trap 'kill 0' SIGINT; \
		cd api && yarn dev & \
		cd client && yarn dev & \
		wait)

# Run only API
dev-api:
	@cd api && yarn dev

# Run only client
dev-client:
	@cd client && yarn dev

# Install all dependencies
install-all:
	@echo "Installing API dependencies..."
	@cd api && yarn install
	@echo "Installing Client dependencies..."
	@cd client && yarn install
	@echo "Done!"
