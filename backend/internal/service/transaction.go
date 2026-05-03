package service

import (
	"sava-io-webapp/backend/internal/model/request"
	"sava-io-webapp/backend/internal/model/response"
)

type TransactionService interface {
	List(accountID *int64) []response.TransactionResponse
	GetByID(id int64) (response.TransactionResponse, bool)
	Create(req *request.TransactionRequest) (response.TransactionResponse, bool, string)
}