run: build
	@./bin/api

build: swag
	@go build -o bin/api cmd/api/main.go

test:
	@godotenv -f .env go test -v ./...

swag:
	@swag init -d cmd/api,internal/data,internal/handlers && swag fmt

up: 
	@godotenv -f .env goose up

down:
	@godotenv -f .env goose down

create: 
	@godotenv -f .env goose create $(name) sql

.PHONY: native

native:
	@cd ./native && bun install && bun gen && bun start
