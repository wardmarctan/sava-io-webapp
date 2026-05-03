package service

import (
	"sava-io-webapp/backend/internal/model/request"
	"sava-io-webapp/backend/internal/model/response"
)

type AccountService interface {
	List() []response.AccountResponse
	GetByID(id int64) (response.AccountResponse, bool)
	Create(req *request.AccountRequest) response.AccountResponse
	Update(id int64, req *request.AccountRequest) (response.AccountResponse, bool)
	Delete(id int64) bool
}