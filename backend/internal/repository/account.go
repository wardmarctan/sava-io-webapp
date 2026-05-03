package repository

import "sava-io-webapp/backend/internal/entity"

type AccountRepository interface {
	List() []entity.Account
}