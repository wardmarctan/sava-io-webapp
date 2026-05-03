package repository

import "sava-io-webapp/backend/internal/entity"

type accountRepository struct {
	store *Store
}

func NewAccountRepository(store *Store) AccountRepository {
	return &accountRepository{store: store}
}

func (r *accountRepository) List() []entity.Account {
	result := make([]entity.Account, len(r.store.Accounts))
	copy(result, r.store.Accounts)
	return result
}