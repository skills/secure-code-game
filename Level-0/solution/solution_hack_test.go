package main

import (
	"bytes"
	"log"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestLoginHandler_UserEnumeration_InvalidEmail(t *testing.T) {
	reqBody := `{"email": "invalid@example.com", "password": "password12345"}`
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
	expectedRespBody := "Invalid Email or Password"
	if respBody != expectedRespBody {
		t.Errorf("Expected body %q, but got %q", expectedRespBody, respBody)
	}
}

func TestLoginHandler_SensitiveLog_InvalidEmail(t *testing.T) {
	reqBody := `{"email": "invalid@example.com", "password": "password12345"}`
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

	var buf bytes.Buffer
	log.SetOutput(&buf)

	log.Printf("Invalid email format")

	logOutput := buf.String()
	expectedRespLog := "Invalid email format"
	if strings.Contains(logOutput, "invalid@example.com") {
		t.Errorf("Expected body %q, but got %q", expectedRespLog, logOutput)
		t.Fail()
	}
}

func TestLoginHandler_SensitiveLog_ValidCredentials(t *testing.T) {
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

	var buf bytes.Buffer
	log.SetOutput(&buf)

	log.Printf("Successful login request")

	logOutput := buf.String()
	expectedRespLog := "Successful login request"
	if strings.Contains(logOutput, "user1@example.com") || strings.Contains(logOutput, "password12345") {
		t.Errorf("Expected body %q, but got %q", expectedRespLog, logOutput)
		t.Fail()
	}
}
