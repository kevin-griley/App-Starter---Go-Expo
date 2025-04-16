package handlers

import (
	"net/http"

	"github.com/kevin-griley/api/internal/data"
	"github.com/kevin-griley/api/internal/middleware"
)

//	@Summary		Create a new user
//	@Description	Create a new user
//	@Tags			User
//	@Accept			json
//	@Produce		json
//	@Param			body	body		data.PostUserRequest	true	"Create User Request"
//	@Success		200		{object}	data.User				"User"
//	@Failure		400		{object}	ApiError				"Bad Request"
//	@Router			/user	[post]
func HandlePostUser(w http.ResponseWriter, r *http.Request) *ApiError {
	ctx := r.Context()

	store, ok := data.GetStore(ctx)
	if !ok {
		return &ApiError{http.StatusInternalServerError, "no database store in context"}
	}

	postReq := new(data.PostUserRequest)
	if err := DecodeJSONRequest(r, postReq, 1<<20); err != nil {
		return &ApiError{http.StatusBadRequest, err.Error()}
	}

	resp, err := store.User.CreateUser(postReq)
	if err != nil {
		return &ApiError{http.StatusInternalServerError, err.Error()}
	}

	return WriteJSON(w, http.StatusOK, resp)
}

//	@Summary		Get user by apiKey
//	@Description	Get user by apiKey
//	@Tags			User
//	@Security		ApiKeyAuth
//	@Accept			json
//	@Produce		json
//	@Success		200			{object}	data.User	"User"
//	@Failure		400			{object}	ApiError	"Bad Request"
//	@Router			/user/me	[get]
func HandleGetUserByKey(w http.ResponseWriter, r *http.Request) *ApiError {
	ctx := r.Context()

	store, ok := data.GetStore(ctx)
	if !ok {
		return &ApiError{http.StatusInternalServerError, "no database store in context"}
	}

	userID, ok := middleware.GetUserID(ctx)
	if !ok {
		return &ApiError{http.StatusBadRequest, "Invalid user id"}
	}

	user, err := store.User.GetUserByID(userID)
	if err != nil {
		return &ApiError{http.StatusNotFound, err.Error()}
	}

	return WriteJSON(w, http.StatusOK, user)
}

//	@Summary		Patch user by apiKey
//	@Description	Patch user by apiKey
//	@Tags			User
//	@Security		ApiKeyAuth
//	@Accept			json
//	@Produce		json
//	@Param			body		body		data.PatchUserRequest	true	"Patch User Request"
//	@Success		200			{object}	data.User				"User"
//	@Failure		400			{object}	ApiError				"Bad Request"
//	@Router			/user/me	[patch]
func HandlePatchUser(w http.ResponseWriter, r *http.Request) *ApiError {
	ctx := r.Context()

	store, ok := data.GetStore(ctx)
	if !ok {
		return &ApiError{http.StatusInternalServerError, "no database store in context"}
	}

	patchReq := new(data.PatchUserRequest)
	if err := DecodeJSONRequest(r, patchReq, 1<<20); err != nil {
		return &ApiError{http.StatusBadRequest, err.Error()}
	}

	userID, ok := middleware.GetUserID(ctx)
	if !ok {
		return &ApiError{http.StatusBadRequest, "Invalid user id"}
	}

	resp, err := store.User.UpdateUser(userID, patchReq)
	if err != nil {
		return &ApiError{http.StatusInternalServerError, err.Error()}
	}

	return WriteJSON(w, http.StatusOK, resp)
}
