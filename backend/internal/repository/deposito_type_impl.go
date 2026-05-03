package repository

import "sava-io-webapp/backend/internal/entity"

type depositoTypeRepository struct {
	store *Store
}

func NewDepositoTypeRepository(store *Store) DepositoTypeRepository {
	return &depositoTypeRepository{store: store}
}

func (r *depositoTypeRepository) List() []entity.DepositoType {
	if r.store == nil || r.store.DB == nil {
		return nil
	}

	var depositoTypes []entity.DepositoType
	r.store.DB.Order("id asc").Find(&depositoTypes)
	return depositoTypes
}