package repository

import (
	"strings"

	"sava-io-webapp/backend/internal/entity"
)

type userRepository struct {
	store *Store
}


func NewUserRepository(store *Store) UserRepository {
	return &userRepository{
		store: store,
	}
}

func (r *userRepository) FindByUsername(username string) (*entity.User, bool) {
	user, ok := r.store.Users[strings.ToLower(strings.TrimSpace(username))]
	if !ok {
		return nil, false
	}

	copy := user
	return &copy, true
}