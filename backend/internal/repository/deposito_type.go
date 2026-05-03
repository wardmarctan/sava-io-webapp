package repository

import "sava-io-webapp/backend/internal/entity"

type DepositoTypeRepository interface {
	List() []entity.DepositoType
	GetByID(id int64) (entity.DepositoType, bool)
	Create(dep entity.DepositoType) entity.DepositoType
	Update(id int64, dep entity.DepositoType) (entity.DepositoType, bool)
	Delete(id int64) bool
}