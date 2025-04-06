package middleware

import (
	"context"
	"net/http"
)

const AuthTokenCookie = "access_token"

type contextKey string

const contextKeyCORS contextKey = "contextKeyCORS"

type CORSMethodKey string

const (
	Session CORSMethodKey = "session"
	Token   CORSMethodKey = "token"
)

type CORSData struct {
	IsLocal bool       
	Domain  string
	Method  CORSMethodKey
}

func CORSMiddleware(next http.HandlerFunc) http.HandlerFunc {
	allowedOrigins := map[string]bool{
		"http://localhost:8081":   true,
		"https://fleetexpand.com": true,
	}

	return func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		w.Header().Set("Vary", "Origin")
		
		ctx := r.Context()
		var corsData CORSData

		if allowedOrigins[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			corsData = CORSData{IsLocal: true, Domain: origin, Method: Session}
		} else {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			corsData = CORSData{IsLocal: false, Domain: "", Method: Token}
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Max-Age", "600")

		ctx = WithCORSData(ctx, corsData)

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next(w, r.WithContext(ctx))
	}
}

func WithCORSData(ctx context.Context, corsData CORSData) context.Context {
	return context.WithValue(ctx, contextKeyCORS, corsData)
}

func GetCORSData(ctx context.Context) (CORSData, bool) {
	corsData, ok := ctx.Value(contextKeyCORS).(CORSData)
	return corsData, ok
}