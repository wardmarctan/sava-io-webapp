package repository

import "sava-io-webapp/backend/internal/entity"

type AccountRepository interface {
	List() []entity.Account
	GetByID(id int64) (entity.Account, bool)
	Create(account *entity.Account) entity.Account
	Update(account *entity.Account) (entity.Account, bool)
	Delete(id int64) bool
}