package handlers

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
)

func HandleAutocomplete(w http.ResponseWriter, r *http.Request) *ApiError {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	input := r.URL.Query().Get("input")
	if input == "" {
		return &ApiError{http.StatusBadRequest, "Missing input parameter"}
	}

	googleURL := fmt.Sprintf("https://maps.googleapis.com/maps/api/place/autocomplete/json?input=%s&key=%s",
		url.QueryEscape(input), os.Getenv("GOOGLE_API_KEY"))

	resp, err := http.Get(googleURL)
	if err != nil {
		return &ApiError{http.StatusInternalServerError, err.Error()}
	}
	defer resp.Body.Close()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)

	return nil
}

func HandleDetails(w http.ResponseWriter, r *http.Request) *ApiError {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	placeID := r.URL.Query().Get("placeid")
	if placeID == "" {
		return &ApiError{http.StatusBadRequest, "Missing placeid parameter"}
	}

	googleURL := fmt.Sprintf("https://maps.googleapis.com/maps/api/place/details/json?placeid=%s&key=%s",
		url.QueryEscape(placeID), os.Getenv("GOOGLE_API_KEY"))

	resp, err := http.Get(googleURL)
	if err != nil {
		return &ApiError{http.StatusInternalServerError, err.Error()}
	}
	defer resp.Body.Close()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)

	return nil
}