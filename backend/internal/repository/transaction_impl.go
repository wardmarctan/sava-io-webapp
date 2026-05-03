package repository

import "sava-io-webapp/backend/internal/entity"

type transactionRepository struct {
	store *Store
}

func NewTransactionRepository(store *Store) TransactionRepository {
	return &transactionRepository{store: store}
}

func (r *transactionRepository) List() []entity.Transaction {
	result := make([]entity.Transaction, len(r.store.Transactions))
	copy(result, r.store.Transactions)
	return result
}