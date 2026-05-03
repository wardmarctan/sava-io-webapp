package repository

import "sava-io-webapp/backend/internal/entity"

type transactionRepository struct {
	store *Store
}

func NewTransactionRepository(store *Store) TransactionRepository {
	return &transactionRepository{store: store}
}

func (r *transactionRepository) List() []entity.Transaction {
	if r.store == nil || r.store.DB == nil {
		return nil
	}

	var transactions []entity.Transaction
	r.store.DB.Order("id asc").Find(&transactions)
	return transactions
}