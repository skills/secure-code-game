// Solution explained:

// 1) Remove the email being logged here:
//	log.Printf("Invalid email format: %q", email)
//	log.Printf("Invalid email format")

// 2) Fix the error message to prevent user enumeration here:
//	http.Error(w, "invalid email or password", http.StatusUnauthorized)
//	http.Error(w, "Invalid Email or Password", http.StatusUnauthorized)

// 3) Remove the email and password being logged here:
//	log.Printf("User %q logged in successfully with a valid password %q", email, password)
//	log.Printf("Successful login request")

// Full solution follows:

package main

import (
	"encoding/json"
	"log"
	"net/http"
	"regexp"
)

var reqBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func isValidEmail(email string) bool {
	// The provided regular expression pattern for email validation by OWASP
	// https://owasp.org/www-community/OWASP_Validation_Regex_Repository
	emailPattern := `^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$`
	match, err := regexp.MatchString(emailPattern, email)
	if err != nil {
		return false
	}
	return match
}

func loginHandler(w http.ResponseWriter, r *http.Request) {

	// Test users
	var testFakeMockUsers = map[string]string{
		"user1@example.com": "password12345",
		"user2@example.com": "B7rx9OkWVdx13$QF6Imq",
		"user3@example.com": "hoxnNT4g&ER0&9Nz0pLO",
		"user4@example.com": "Log4Fun",
	}

	if r.Method == "POST" {

		decode := json.NewDecoder(r.Body)
		decode.DisallowUnknownFields()

		err := decode.Decode(&reqBody)
		if err != nil {
			http.Error(w, "Cannot decode body", http.StatusBadRequest)
			return
		}
		email := reqBody.Email
		password := reqBody.Password

		if !isValidEmail(email) {
			// Fix: Removing the email from the log
			// log.Printf("Invalid email format: %q", email)
			log.Printf("Invalid email format")
			http.Error(w, "Invalid email format", http.StatusBadRequest)
			return
		}

		storedPassword, ok := testFakeMockUsers[email]
		if !ok {
			// Fix: Correcting the message to prevent user enumeration
			// http.Error(w, "invalid email or password", http.StatusUnauthorized)
			http.Error(w, "Invalid Email or Password", http.StatusUnauthorized)
			return
		}

		if password == storedPassword {
			// Fix: Removing the email and password from the log
			// log.Printf("User %q logged in successfully with a valid password %q", email, password)
			log.Printf("Successful login request")
			w.WriteHeader(http.StatusOK)
		} else {
			http.Error(w, "Invalid Email or Password", http.StatusUnauthorized)
		}

	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}

func main() {
	http.HandleFunc("/login", loginHandler)
	log.Print("Server started. Listening on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalf("HTTP server ListenAndServe: %q", err)
	}
}
