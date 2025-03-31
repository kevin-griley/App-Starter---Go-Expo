package handlers

import (
	"net/http"

	"github.com/kevin-griley/api/internal/data"
	"github.com/kevin-griley/api/internal/middleware"
)

//	@Summary		Get associations by apiKey
//	@Description	Get associations by apiKey
//	@Tags			User Associations
//	@Security		ApiKeyAuth
//	@Accept			json
//	@Produce		json
//	@Param			expand		query		[]string		false	"Expand associations"
// 	@Success		200			{object}	[]data.Association	"Associations"
// 	@Failure		400			{object}	ApiError			"Bad Request"
// 	@Router			/user_associations/me	[get]
func HandleGetAssociationsByKey(w http.ResponseWriter, r *http.Request) *ApiError {
	ctx := r.Context()

	store, ok := data.GetStore(ctx)
	if !ok {
		return &ApiError{http.StatusInternalServerError, "no database store in context"}
	}

	userID, ok := middleware.GetUserID(ctx)
	if !ok {
		return &ApiError{http.StatusBadRequest, "Invalid user id"}
	}

	expands := r.URL.Query()["expand"]

	associations, err := store.Association.GetAssociationByUserID(userID, expands)
	if err != nil {
		return &ApiError{http.StatusInternalServerError, err.Error()}
	}

	return WriteJSON(w, http.StatusOK, associations)
}


