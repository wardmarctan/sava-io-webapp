package repository

import "sava-io-webapp/backend/internal/entity"

type UserRepository interface {
	FindByUsername(username string) (*entity.User, bool)
}