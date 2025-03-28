package main

import (
	"log"
	"log/slog"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/kevin-griley/api/docs"

	"github.com/kevin-griley/api/internal/data"
	"github.com/kevin-griley/api/internal/db"
	"github.com/kevin-griley/api/internal/handlers"
	"github.com/kevin-griley/api/internal/middleware"
	httpSwagger "github.com/swaggo/http-swagger"
)

//	@title			Rest API
//	@description	API for the ULD Management System
//
// @version         1.0
// @BasePath					/
// @securityDefinitions.apikey	Bearer Authentication
// @tokenUrl http://localhost:3000/login
// @in							header
// @name						Authorization
// @description					A valid JWT token with Bearer prefix
func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Failed to load embedded .env file:", err)
	}

	listenAddress := ":8080"
	docs.SwaggerInfo.Host = "localhost:8080"

	mux := http.NewServeMux()

	mux.HandleFunc("GET /docs/", httpSwagger.WrapHandler)
	mux.HandleFunc("POST /auth/login", handlers.HandleApiError(handlers.HandlePostLogin))
	mux.HandleFunc("DELETE /auth/logout", handlers.HandleApiError(handlers.HandleGetLogout))
	mux.HandleFunc("POST /auth/reset/request", handlers.HandleApiError(handlers.HandlePostResetRequest))
	mux.HandleFunc("POST /auth/reset/confirm", handlers.HandleApiError(handlers.HandlePostResetConfirm))

	mux.HandleFunc("POST /user", handlers.HandleApiError(handlers.HandlePostUser))
	GetUserByKeyHandler := middleware.JwtAuthMiddleware(handlers.HandleApiError(handlers.HandleGetUserByKey))
	mux.HandleFunc("GET /user/me", GetUserByKeyHandler)
	PatchUserHandler := middleware.JwtAuthMiddleware(handlers.HandleApiError(handlers.HandlePatchUser))
	mux.HandleFunc("PATCH /user/me", PatchUserHandler)

	PostOrganization := middleware.Chain(
		handlers.HandleApiError(handlers.HandlePostOrganization),
		middleware.JwtAuthMiddleware,
		middleware.ScopeMiddleware("organization:write"),
	)
	mux.HandleFunc("POST /organization/{ID}", PostOrganization)
	HandlePatchOrganizationByID := middleware.Chain(
		handlers.HandleApiError(handlers.HandlePatchOrganizationByID),
		middleware.JwtAuthMiddleware,
		middleware.ScopeMiddleware("organization:write"),
	)
	mux.HandleFunc("PATCH /organization/{ID}", HandlePatchOrganizationByID)

	dbConn, err := db.Init()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close(dbConn)

	store := data.NewStore(dbConn)

	finalHandler := middleware.Chain(
		mux.ServeHTTP,
		middleware.LoggingMiddleware,
		middleware.CORSMiddleware,
		middleware.StoreMiddleware(store),
	)

	slog.Info("Application", "Swagger Docs Url", "http://localhost:8080/docs")

	http.ListenAndServe(listenAddress, finalHandler)
}
