package repository

import "sava-io-webapp/backend/internal/entity"

type userRepository struct {
	store *Store
}


func NewUserRepository(store *Store) UserRepository {
	return &userRepository{
		store: store,
	}
}

func (r *userRepository) FindByUsername(username string) (*entity.User, bool) {
	if r.store == nil || r.store.DB == nil {
		return nil, false
	}

	var user entity.User
	if err := r.store.DB.Where("LOWER(username) = LOWER(?)", username).First(&user).Error; err != nil {
		return nil, false
	}

	return &user, true
}