package repository

import "sava-io-webapp/backend/internal/entity"

type TransactionRepository interface {
	List() []entity.Transaction
}