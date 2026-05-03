package repository

import "sava-io-webapp/backend/internal/entity"

type TransactionRepository interface {
	List(accountID *int64) []entity.Transaction
	GetByID(id int64) (entity.Transaction, bool)
	Create(tx *entity.Transaction) entity.Transaction
}