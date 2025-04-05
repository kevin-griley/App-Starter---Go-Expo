
# (a) Build stage
FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o bin/api cmd/api/main.go

# (b) Final stage
FROM alpine:3.18
WORKDIR /app
COPY --from=builder /app/bin/api /app/api
COPY .env .env
EXPOSE 8080
CMD ["/app/api"]

