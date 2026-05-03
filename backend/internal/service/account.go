package service

import "sava-io-webapp/backend/internal/entity"

type AccountService interface {
	List() []entity.Account
}