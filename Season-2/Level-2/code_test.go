// Run code_test.go by following the instructions below:

// This file contains passing tests.

// Run them by opening a terminal and running the following:
// $ go test -v Season-2/Level-2/code.go Season-2/Level-2/code_test.go

// If 'go' is not found when running the above, install it from:
// https://go.dev/dl/

package main

import (
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
	"time"
)

func TestLoginHandler_ValidCredentials(t *testing.T) {
	reqBody := `{"email": "user1@example.com", "password": "password12345"}`
	req, err := http.NewRequest("POST", "/login", strings.NewReader(reqBody))
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	recorder := httptest.NewRecorder()
	handler := http.HandlerFunc(loginHandler)
	handler.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusOK {
		t.Errorf("Expected status code %d, but got %d", http.StatusOK, recorder.Code)
	}
}

func TestLoginHandler_InvalidCredentials(t *testing.T) {
	reqBody := `{"email": "user1@example.com", "password": "invalid_password"}`
	req, err := http.NewRequest("POST", "/login", strings.NewReader(reqBody))
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	recorder := httptest.NewRecorder()
	handler := http.HandlerFunc(loginHandler)
	handler.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusUnauthorized {
		t.Errorf("Expected status code %d, but got %d", http.StatusUnauthorized, recorder.Code)
	}

	respBody := strings.TrimSpace(recorder.Body.String())
	if respBody != "Invalid Email or Password" {
		t.Errorf("Expected body %q, but got %q", "Invalid Email or Password", respBody)
	}
}

func TestLoginHandler_InvalidEmailFormat(t *testing.T) {
	reqBody := `{"email": "invalid_email", "password": "password12345"}`
	req, err := http.NewRequest("POST", "/login", strings.NewReader(reqBody))
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	recorder := httptest.NewRecorder()
	handler := http.HandlerFunc(loginHandler)
	handler.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusBadRequest {
		t.Errorf("Expected status code %d, but got %d", http.StatusBadRequest, recorder.Code)
	}

	respBody := strings.TrimSpace(recorder.Body.String())
	expectedRespBody := "Invalid email format"
	if respBody != expectedRespBody {
		t.Errorf("Expected body %q, but got %q", expectedRespBody, respBody)
	}
}

func TestLoginHandler_InvalidRequestMethod(t *testing.T) {
	req, err := http.NewRequest("GET", "/login", nil)
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	recorder := httptest.NewRecorder()
	handler := http.HandlerFunc(loginHandler)
	handler.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusMethodNotAllowed {
		t.Errorf("Expected status code %d, but got %d", http.StatusMethodNotAllowed, recorder.Code)
	}

	respBody := strings.TrimSpace(recorder.Body.String())
	expectedRespBody := "Invalid request method"
	if respBody != expectedRespBody {
		t.Errorf("Expected body %q, but got %q", expectedRespBody, respBody)
	}
}

func TestLoginHandler_UnknownFieldsInRequestBody(t *testing.T) {
	reqBody := `{"email": "user1@example.com", "password": "password12345", "unknown_field": "value"}`

	req, err := http.NewRequest("POST", "/login", strings.NewReader(reqBody))
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	recorder := httptest.NewRecorder()
	handler := http.HandlerFunc(loginHandler)
	handler.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusBadRequest {
		t.Errorf("Expected status code %d, but got %d", http.StatusBadRequest, recorder.Code)
	}

	respBody := strings.TrimSpace(recorder.Body.String())
	expectedRespBody := "Cannot decode body"
	if respBody != expectedRespBody {
		t.Errorf("Expected body %q, but got %q", expectedRespBody, respBody)
	}
}

func TestMain(m *testing.M) {
	go func() {
		main()
	}()

	time.Sleep(500 * time.Millisecond)

	exitCode := m.Run()
	os.Exit(exitCode)
}