package repository

import "sava-io-webapp/backend/internal/entity"

type transactionRepository struct {
	store *Store
}

func NewTransactionRepository(store *Store) TransactionRepository {
	return &transactionRepository{store: store}
}

func (r *transactionRepository) List(accountID *int64) []entity.Transaction {
	if r.store == nil || r.store.DB == nil {
		return nil
	}

	var transactions []entity.Transaction
	query := r.store.DB.
		Preload("Account").
		Preload("Account.Customer").
		Preload("Account.DepositoType")

	if accountID != nil && *accountID != 0 {
		query = query.Where("account_id = ?", *accountID)
	}

	query.Order("transaction_date desc, id desc").Find(&transactions)
	return transactions
}

func (r *transactionRepository) GetByID(id int64) (entity.Transaction, bool) {
	if r.store == nil || r.store.DB == nil {
		return entity.Transaction{}, false
	}

	var tx entity.Transaction
	if err := r.store.DB.
		Preload("Account").
		Preload("Account.Customer").
		Preload("Account.DepositoType").
		First(&tx, id).Error; err != nil {
		return entity.Transaction{}, false
	}

	return tx, true
}

func (r *transactionRepository) Create(tx *entity.Transaction) entity.Transaction {
	if r.store == nil || r.store.DB == nil || tx == nil {
		return entity.Transaction{}
	}

	_ = r.store.DB.Create(tx)
	return *tx
}