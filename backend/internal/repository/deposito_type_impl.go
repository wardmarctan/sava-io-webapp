package repository

import "sava-io-webapp/backend/internal/entity"

type depositoTypeRepository struct {
	store *Store
}

func NewDepositoTypeRepository(store *Store) DepositoTypeRepository {
	return &depositoTypeRepository{store: store}
}

func (r *depositoTypeRepository) List() []entity.DepositoType {
	result := make([]entity.DepositoType, len(r.store.DepositoTypes))
	copy(result, r.store.DepositoTypes)
	return result
}