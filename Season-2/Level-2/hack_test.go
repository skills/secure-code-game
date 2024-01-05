// Run hack_test.go by following the instructions below:

// This file exploits the vulnerabilities in code. Running this file will fail initially
// (it contains failing tests). As all other levels, your goal is to get this file to pass.

// Run hack by opening a terminal and running the following:
// $ go test -v Season-2/Level-2/code.go Season-2/Level-2/hack_test.go

// As a reminder, to pass this level, both this file alongside code_test.go must pass.

// If 'go' is not found when running the above, install it from:
// https://go.dev/dl/

package main

import (
	"bytes"
	"log"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

// If this test fails, please fix the code to prevent user enumeration (code.go)
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

// If this test fails, please fix the code to not log sensitive information (code.go)
func TestLoginHandler_SensitiveLog_InvalidEmail_FIXME(t *testing.T) {
	var buf bytes.Buffer
	log.SetOutput(&buf)

	reqBody := `{"email": "in.valid@ex@mple.com", "password": "password12345"}`
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

	logOutput := buf.String()
	expectedRespLog := "Invalid email format"
	if strings.Contains(logOutput, "in.valid@ex@mple.com") {
		t.Errorf("Expected body %q, but got %q", expectedRespLog, logOutput)
		t.Fail()
	}
}

// If this test fails, please fix the code to not log sensitive information (code.go)
func TestLoginHandler_SensitiveLog_ValidCredentials_FIXME(t *testing.T) {
	var buf bytes.Buffer
	log.SetOutput(&buf)

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

	logOutput := buf.String()
	expectedRespLog := "Successful login request"
	if strings.Contains(logOutput, "user1@example.com") || strings.Contains(logOutput, "password12345") {
		t.Errorf("Expected body %q, but got %q", expectedRespLog, logOutput)
		t.Fail()
	}
}
