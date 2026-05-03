package service

import (
	"sava-io-webapp/backend/internal/model/request"
	"sava-io-webapp/backend/internal/model/response"
)

type AuthService interface {
	Login(payload request.LoginRequest) (*response.LoginResponse, error)
}