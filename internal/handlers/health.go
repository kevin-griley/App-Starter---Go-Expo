package handlers

import (
	"net/http"
)

//	@Summary		Health check
//	@Description	Health check
//	@Tags			Health
//	@Accept			json
//	@Produce		json
//	@Success		200	{string}	string	"OK"
//	@Router			/health	[get]
func HandleHealthCheck(w http.ResponseWriter, r *http.Request) *ApiError {
	return WriteJSON(w, http.StatusOK, "OK")
}
