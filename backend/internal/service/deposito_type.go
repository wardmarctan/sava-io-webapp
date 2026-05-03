package service

import "sava-io-webapp/backend/internal/entity"

type DepositoTypeService interface {
	List() []entity.DepositoType
}