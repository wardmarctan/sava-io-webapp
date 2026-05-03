package service

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"time"

	"sava-io-webapp/backend/internal/model/request"
	"sava-io-webapp/backend/internal/model/response"
	"sava-io-webapp/backend/internal/repository"
)

type authService struct {
	users repository.UserRepository
}

func NewAuthService(users repository.UserRepository) AuthService {
	return &authService{users: users}
}

func (s *authService) Login(payload request.LoginRequest) (*response.LoginResponse, error) {
	user, ok := s.users.FindByUsername(payload.Username)
	if !ok || user.Password != payload.Password {
		return nil, errors.New("invalid username or password")
	}

	return &response.LoginResponse{
		AccessToken:  generateToken(user.Username, "access"),
		RefreshToken: generateToken(user.Username, "refresh"),
		User: response.LoginUser{
			Username: user.Username,
			Role:     user.Role,
		},
	}, nil
}

func generateToken(username, tokenType string) string {
	var buffer [16]byte
	_, _ = rand.Read(buffer[:])

	seed := fmt.Sprintf("%s:%s:%d:%s", username, tokenType, time.Now().UnixNano(), base64.RawURLEncoding.EncodeToString(buffer[:]))
	return base64.RawURLEncoding.EncodeToString([]byte(seed))
}