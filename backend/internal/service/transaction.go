package service

import "sava-io-webapp/backend/internal/entity"

type TransactionService interface {
	List() []entity.Transaction
}