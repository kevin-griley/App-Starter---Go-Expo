package middleware

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)



func JwtAuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		ctx := r.Context()
		corsData, ok := GetCORSData(r.Context())
		if !ok {
			slog.Error("JwtAuthMiddleware", "GetCORSData", errors.New("no CORS data in context"))
			PermissionDenied(w)
			return
		}

		var tokenStr string

		switch corsData.Method {
		case Session:
			cookie, err := r.Cookie(AuthTokenCookie)
			if err != nil {
				slog.Error("JwtAuthMiddleware", "r.Cookie", err)
				PermissionDenied(w)
				return
			}
			tokenStr = cookie.Value
		case Token:
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				slog.Error("JwtAuthMiddleware", "r.Header.Get", errors.New("no authorization header"))
				PermissionDenied(w)
				return
			}
			var err error
			tokenStr, err = ExtractBearerToken(authHeader)
			if err != nil {
				slog.Error("JwtAuthMiddleware", "ExtractBearerToken", err)
				PermissionDenied(w)
				return
			}
		}

		token, err := ValidateJWT(tokenStr)
		if err != nil || !token.Valid {
			slog.Error("JwtAuthMiddleware", "ValidateJWT", err)
			PermissionDenied(w)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			slog.Error("JwtAuthMiddleware", "token.Claims", err)
			PermissionDenied(w)
			return
		}

		subject, err := claims.GetSubject()
		if err != nil {
			slog.Error("JwtAuthMiddleware", "claims.GetSubject", err)
			PermissionDenied(w)
			return
		}

		userID, err := uuid.Parse(subject)
		if err != nil {
			PermissionDenied(w)
			return
		}

		ctx = withUserID(ctx, userID)
		ctx = withClaims(ctx, claims)

		next(w, r.WithContext(ctx))

	}
}

func ValidateJWT(tokenStr string) (*jwt.Token, error) {
	secret := os.Getenv("JWT_SECRET")
	return jwt.Parse(tokenStr, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})
}

const ContextKeyUserID ContextKey = "ContextKeyUserID"
const ContextKeyClaims ContextKey = "ContextKeyClaims"


func PermissionDenied(w http.ResponseWriter) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusForbidden)
	w.Write([]byte(`{"status":403,"error":"Permission Denied"}`))
}

func GetUserID(ctx context.Context) (uuid.UUID, bool) {
	userID, ok := ctx.Value(ContextKeyUserID).(uuid.UUID)
	return userID, ok
}

func withUserID(ctx context.Context, userID uuid.UUID) context.Context {
	return context.WithValue(ctx, ContextKeyUserID, userID)
}

func GetClaims(ctx context.Context) (jwt.MapClaims, bool) {
	claims, ok := ctx.Value(ContextKeyClaims).(jwt.MapClaims)
	return claims, ok
}

func withClaims(ctx context.Context, claims jwt.MapClaims) context.Context {
	return context.WithValue(ctx, ContextKeyClaims, claims)
}


func ExtractBearerToken(authHeader string) (string, error) {
	const prefix = "Bearer "
	if !strings.HasPrefix(authHeader, prefix) {
		return "", errors.New("authorization header must be in Bearer format")
	}
	return strings.TrimSpace(strings.TrimPrefix(authHeader, prefix)), nil
}
