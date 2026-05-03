package service

import "sava-io-webapp/backend/internal/entity"

type DepositoTypeService interface {
	List() []entity.DepositoType
	GetByID(id int64) (entity.DepositoType, bool)
	Create(name string, yearlyReturn float64) entity.DepositoType
	Update(id int64, name string, yearlyReturn float64) (entity.DepositoType, bool)
	Delete(id int64) bool
}