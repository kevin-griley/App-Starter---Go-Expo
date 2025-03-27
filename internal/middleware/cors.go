package middleware

import "net/http"


func CORSMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		origin := r.Header.Get("Origin")
		allowedOrigins := map[string]bool{
			"http://localhost:8081":   true, 
			"https://app.example.com": true, 
		}

		if allowedOrigins[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true") 
		} else {
			w.Header().Set("Access-Control-Allow-Origin", "*") 
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
    	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next(w, r)
	}
}


