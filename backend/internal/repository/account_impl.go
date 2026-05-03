package repository

import "sava-io-webapp/backend/internal/entity"

type accountRepository struct {
	store *Store
}

func NewAccountRepository(store *Store) AccountRepository {
	return &accountRepository{store: store}
}

func (r *accountRepository) List() []entity.Account {
	if r.store == nil || r.store.DB == nil {
		return nil
	}

	var accounts []entity.Account
	r.store.DB.Order("id asc").Find(&accounts)
	return accounts
}