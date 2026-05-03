package repository

import "sava-io-webapp/backend/internal/entity"

type DepositoTypeRepository interface {
	List() []entity.DepositoType
}