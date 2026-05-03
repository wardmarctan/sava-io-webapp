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

func (r *depositoTypeRepository) GetByID(id int64) (entity.DepositoType, bool) {
	if r.store == nil || r.store.DB == nil {
		return entity.DepositoType{}, false
	}

	var dt entity.DepositoType
	if err := r.store.DB.First(&dt, id).Error; err != nil {
		return entity.DepositoType{}, false
	}

	return dt, true
}

func (r *depositoTypeRepository) Create(dep entity.DepositoType) entity.DepositoType {
	if r.store == nil || r.store.DB == nil {
		return dep
	}

	dep.ID = 0
	_ = r.store.DB.Create(&dep)
	return dep
}

func (r *depositoTypeRepository) Update(id int64, dep entity.DepositoType) (entity.DepositoType, bool) {
	if r.store == nil || r.store.DB == nil {
		return entity.DepositoType{}, false
	}

	dep.ID = id
	result := r.store.DB.Model(&entity.DepositoType{}).Where("id = ?", id).Updates(map[string]any{"name": dep.Name, "yearly_return": dep.YearlyReturn})
	if result.Error != nil || result.RowsAffected == 0 {
		return entity.DepositoType{}, false
	}

	return dep, true
}

func (r *depositoTypeRepository) Delete(id int64) bool {
	if r.store == nil || r.store.DB == nil {
		return false
	}

	result := r.store.DB.Delete(&entity.DepositoType{}, id)
	return result.Error == nil && result.RowsAffected > 0
}