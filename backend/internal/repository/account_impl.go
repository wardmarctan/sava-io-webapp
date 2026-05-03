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
	r.store.DB.Preload("Customer").Preload("DepositoType").Order("id asc").Find(&accounts)
	return accounts
}

func (r *accountRepository) GetByID(id int64) (entity.Account, bool) {
	var account entity.Account
	result := r.store.DB.Preload("Customer").Preload("DepositoType").First(&account, id)
	if result.Error != nil {
		return account, false
	}
	return account, true
}

func (r *accountRepository) Create(account *entity.Account) entity.Account {
	r.store.DB.Create(account)
	r.store.DB.Preload("Customer").Preload("DepositoType").First(account, account.ID)
	return *account
}

func (r *accountRepository) Update(account *entity.Account) (entity.Account, bool) {
	var existing entity.Account
	if err := r.store.DB.First(&existing, account.ID).Error; err != nil {
		return existing, false
	}
	r.store.DB.Save(account)
	r.store.DB.Preload("Customer").Preload("DepositoType").First(account, account.ID)
	return *account, true
}

func (r *accountRepository) Delete(id int64) bool {
	// Distinguish "not found" vs "cannot delete due to FK".
	var existing entity.Account
	if err := r.store.DB.First(&existing, id).Error; err != nil {
		return false
	}

	result := r.store.DB.Delete(&entity.Account{}, id)
	return result.Error == nil && result.RowsAffected > 0
}