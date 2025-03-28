package handlers

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/kevin-griley/api/internal/data"
	"github.com/kevin-griley/api/internal/middleware"
)

type PostAuthRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type PostAuthResponse struct {
	Token string `json:"token"`
}

// @Summary			Retrive token for bearer authentication
// @Description		Retrive token for bearer authentication
// @Tags			Auth
// @Accept			json
// @Produce			json
// @Param			body	body		PostAuthRequest	true	"Login Request"
// @Success			200		{object}	PostAuthResponse	"Token Response"
// @Failure			400		{object} 	ApiError	"Bad Request"
// @Failure			401		{object} 	ApiError	"Unauthorized"
// @Router			/auth/login			[post]
func HandlePostLogin(w http.ResponseWriter, r *http.Request) *ApiError {
	ctx := r.Context()

	store, ok := data.GetStore(ctx)
	if !ok {
		return &ApiError{http.StatusInternalServerError, "no database store in context"}
	}

	postReq := new(PostAuthRequest)
	if err := DecodeJSONRequest(r, postReq, 1<<20); err != nil {
		return &ApiError{http.StatusBadRequest, err.Error()}
	}

	if postReq.Email == "" || postReq.Password == "" {
		return &ApiError{http.StatusBadRequest, "email and password are required"}
	}

	user, err := store.User.GetUserByEmail(postReq.Email)
	if err != nil {
		return &ApiError{http.StatusUnauthorized, "invalid user or password"}
	}

	if user.IsDeleted {
		return &ApiError{http.StatusUnauthorized, "invalid user or password"}
	}

	if user.FailedLoginAttempts >= 10 && time.Since(user.UpdatedAt).Minutes() < 30 {
		return &ApiError{http.StatusUnauthorized, "account locked due to too many failed login attempts please try again later"}
	}

	if !user.ValidPassword(postReq.Password) {
		user.FailedLoginAttempts++
		_, err := store.User.UpdateUser(user)
		if err != nil {
			log.Printf("failed to update user: %v", err)
			return &ApiError{http.StatusInternalServerError, err.Error()}
		}
		return &ApiError{http.StatusUnauthorized, "invalid user or password"}
	}

	user.FailedLoginAttempts = 1
	user.LastLogin = time.Now().UTC()
	user, err = store.User.UpdateUser(user)

	if err != nil {
		return &ApiError{http.StatusInternalServerError, err.Error()}
	}

	tokenString, err := CreateJWT(user)
	if err != nil {
		return &ApiError{http.StatusInternalServerError, err.Error()}
	}

	corsData, ok := middleware.GetCORSData(ctx)
	if !ok {
		return &ApiError{http.StatusInternalServerError, "no corsData in context"}
	}

	if corsData.Method == middleware.Session {
		cookieDomain, err := url.Parse(corsData.Domain)
		if err != nil {
			return &ApiError{http.StatusInternalServerError, err.Error()}
		}

		http.SetCookie(w, &http.Cookie{
			Name:     middleware.AuthTokenCookie,
			Value:    tokenString,
			Path:     "/",
			Domain:   "."+cookieDomain.Hostname(),
			HttpOnly: true,
			Secure:   !corsData.IsLocal,
			SameSite: http.SameSiteStrictMode,
			Expires:  time.Now().Add(24 * time.Hour),
		})

	}

	return WriteJSON(w, http.StatusOK, PostAuthResponse{Token: tokenString})
}

// @Summary			Removes HttpOnly cookie from client
// @Description		Removes HttpOnly cookie from client
// @Tags			Auth
// @Accept			json
// @Produce			json
// @Success			200		{string}	string	"OK"
// @Router			/auth/logout		[delete]
func HandleGetLogout(w http.ResponseWriter, r *http.Request) *ApiError {

	ctx := r.Context()

	corsData, ok := middleware.GetCORSData(ctx)
	if !ok {
		return &ApiError{http.StatusInternalServerError, "no corsData in context"}
	}

	if corsData.Method == middleware.Session {
		cookieDomain, err := url.Parse(corsData.Domain)
		if err != nil {
			return &ApiError{http.StatusInternalServerError, err.Error()}
		}

		http.SetCookie(w, &http.Cookie{
			Name:     middleware.AuthTokenCookie,
			Value:    "",
			Path:     "/",
			Domain:   "."+cookieDomain.Host,
			Expires:  time.Unix(0, 0),
			MaxAge:  -1,
			HttpOnly: true,
			Secure:   !corsData.IsLocal,			
		})

	}

	return WriteJSON(w, http.StatusOK, "OK")
}

type PostAuthResetRequest struct {
	Email    string `json:"email"`
}

// @Summary			Requests a password reset
// @Description		Requests a password reset
// @Tags			Auth
// @Accept			json
// @Produce			json
// @Param			body	body		PostAuthResetRequest	true	"Reset Request"
// @Success			200		{object}	data.User	"User"
// @Failure			400		{object} 	ApiError	"Bad Request"
// @Router			/auth/reset/request	[post]
func HandlePostResetRequest(w http.ResponseWriter, r *http.Request) *ApiError {
	ctx := r.Context()

	store, ok := data.GetStore(ctx)
	if !ok {
		return &ApiError{http.StatusInternalServerError, "no database store in context"}
	}

	postReq := new(PostAuthResetRequest)
	if err := DecodeJSONRequest(r, postReq, 1<<20); err != nil {
		return &ApiError{http.StatusBadRequest, err.Error()}
	}

	user, err := store.User.GetUserByEmail(postReq.Email)
	if err != nil {
		return &ApiError{http.StatusUnauthorized, "invalid user"}
	}

	tokenString, err := CreateResetJWT(user)
	if err != nil {
		return &ApiError{http.StatusInternalServerError, err.Error()}
	}

	corsData, ok := middleware.GetCORSData(ctx)
	if !ok {
		return &ApiError{http.StatusInternalServerError, "no corsData in context"}
	}

	resetLink := fmt.Sprintf("%s/confirm-password?token=%s", corsData.Domain, tokenString)
	fmt.Println(resetLink)

	return WriteJSON(w, http.StatusOK, user)
}

type PostAuthResetConfirm struct {
    ConfirmCode string `json:"confirm_code"`
    NewPassword string `json:"new_password"`
}

// @Summary			Confirms a password reset
// @Description		Confirms a password reset
// @Tags			Auth
// @Accept			json
// @Produce			json
// @Param			body	body		PostAuthResetConfirm	true	"Reset Confirm"
// @Success			200		{object}	data.User	"User"
// @Failure			400		{object} 	ApiError	"Bad Request"
// @Router			/auth/reset/confirm	[post]
func HandlePostResetConfirm(w http.ResponseWriter, r *http.Request) *ApiError {
	ctx := r.Context()

	store, ok := data.GetStore(ctx)
	if !ok {
		return &ApiError{http.StatusInternalServerError, "no database store in context"}
	}

	postReq := new(PostAuthResetConfirm)
	if err := DecodeJSONRequest(r, postReq, 1<<20); err != nil {
		return &ApiError{http.StatusBadRequest, err.Error()}
	}

	token, err := middleware.ValidateJWT(postReq.ConfirmCode)
	if err != nil {
		return &ApiError{http.StatusUnauthorized, "invalid token"}
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return &ApiError{http.StatusUnauthorized, "invalid token"}
	}

	subject, err := claims.GetSubject()
	if err != nil {
		return &ApiError{http.StatusUnauthorized, "invalid token"}
	}

	user, err := store.User.UpdateRequest("", postReq.NewPassword)
	if err != nil {
		return &ApiError{http.StatusInternalServerError, err.Error()}
	}

	userID, err := uuid.Parse(subject)
	if err != nil {
		return &ApiError{http.StatusInternalServerError, err.Error()}
	}

	user.ID = userID

	resp, err := store.User.UpdateUser(user)
	if err != nil {
		return &ApiError{http.StatusInternalServerError, err.Error()}
	}

	return WriteJSON(w, http.StatusOK, resp)

}


func CreateJWT(user *data.User) (string, error) {
	claims := &jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		NotBefore: jwt.NewNumericDate(time.Now()),
		Issuer:    "session",
		Subject:   user.ID.String(),
	}

	secret := os.Getenv("JWT_SECRET")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))

}

func CreateResetJWT(user *data.User) (string, error) {
	claims := &jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour)),
		Issuer:    "password_reset",
		Subject:   user.ID.String(),
		
	}
	secret := os.Getenv("JWT_SECRET")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))

}