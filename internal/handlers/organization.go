package handlers

import (
	"net/http"

	"github.com/kevin-griley/api/internal/data"
	"github.com/kevin-griley/api/internal/middleware"
)

//	@Summary		Create a new organization
//	@Description	Create a new organization
//	@Tags			Organization
//	@Accept			json
//	@Produce		json
//	@Param			body			body		data.PostOrganizationRequest	true			"Create Organization Request"
//	@Success		200				{object}	data.Organization				"Organization"
//	@Failure		400				{object}	ApiError						"Bad Request"
//	@Router			/organization	[post]
func HandlePostOrganization(w http.ResponseWriter, r *http.Request) *ApiError {
	ctx := r.Context()

	store, ok := data.GetStore(ctx)
	if !ok {
		return &ApiError{http.StatusInternalServerError, "no database store in context"}
	}

	postReq := new(data.PostOrganizationRequest)
	if err := DecodeJSONRequest(r, postReq, 1<<20); err != nil {
		return &ApiError{http.StatusBadRequest, err.Error()}
	}

	resp, err := store.Organization.CreateOrganization(postReq)
	if err != nil {
		return &ApiError{http.StatusInternalServerError, err.Error()}
	}

	userID, ok := middleware.GetUserID(ctx)
	if !ok {
		return &ApiError{http.StatusBadRequest, "Invalid user id"}
	}

	permissions := []data.PermissionsEnum{
		data.WriteOrganization,
	}

	_, err = store.Association.CreateAssociation(&data.PostAssociationRequest{
		OrganizationID: resp.ID,
		Permissions:   permissions,
		UserID: 	  userID,
		Status:       data.Active,
	})
	
	if err != nil {
		return &ApiError{http.StatusInternalServerError, err.Error()}
	}

	return WriteJSON(w, http.StatusOK, resp)
}

//	@Summary		Get organization by ID
//	@Description	Get organization by ID
//	@Tags			Organization
//	@Security		ApiKeyAuth
//	@Accept			json
//	@Produce		json
//	@Param			ID					path		string				true	"Organization ID"
//	@Success		200					{object}	data.Organization	"Organization"
//	@Failure		400					{object}	ApiError			"Bad Request"
//	@Router			/organization/{ID}	[get]
func HandleGetOrganizationByID(w http.ResponseWriter, r *http.Request) *ApiError {
	ctx := r.Context()

	store, ok := data.GetStore(ctx)
	if !ok {
		return &ApiError{http.StatusInternalServerError, "no database store in context"}
	}

	orgId, err := GetPathID(r)
	if err != nil {
		return &ApiError{http.StatusBadRequest, err.Error()}
	}

	org, err := store.Organization.GetOrganizationByID(orgId)
	if err != nil {
		return &ApiError{http.StatusInternalServerError, err.Error()}
	}

	return WriteJSON(w, http.StatusOK, org)
}


//	@Summary		Patch organization by ID
//	@Description	Patch organization by ID
//	@Tags			Organization
//	@Security		ApiKeyAuth
//	@Accept			json
//	@Produce		json
//	@Param			ID					path		string							true	"Organization ID"
//	@Param			body				body		data.PatchOrganizationRequest	true	"Patch Organization Request"
//	@Success		200					{object}	data.Organization				"Organization"
//	@Failure		400					{object}	ApiError						"Bad Request"
//	@Router			/organization/{ID}	[patch]
func HandlePatchOrganizationByID(w http.ResponseWriter, r *http.Request) *ApiError {
	ctx := r.Context()

	store, ok := data.GetStore(ctx)
	if !ok {
		return &ApiError{http.StatusInternalServerError, "no database store in context"}
	}

	patchReq := new(data.PatchOrganizationRequest)
	if err := DecodeJSONRequest(r, patchReq, 1<<20); err != nil {
		return &ApiError{http.StatusBadRequest, err.Error()}
	}

	orgId, err := GetPathID(r)
	if err != nil {
		return &ApiError{http.StatusBadRequest, err.Error()}
	}

	resp, err := store.Organization.UpdateOrganization(orgId, patchReq)
	if err != nil {
		return &ApiError{http.StatusInternalServerError, err.Error()}
	}

	return WriteJSON(w, http.StatusOK, resp)

}
