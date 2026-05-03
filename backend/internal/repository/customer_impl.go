package repository

import (
	"sava-io-webapp/backend/internal/entity"
)

type customerRepository struct {
	store *Store
}

func NewCustomerRepository(store *Store) CustomerRepository {
	return &customerRepository{store: store}
}

func (r *customerRepository) List() []entity.Customer {
	if r.store == nil || r.store.DB == nil {
		return nil
	}

	var customers []entity.Customer
	r.store.DB.Order("id asc").Find(&customers)
	return customers
}

func (r *customerRepository) GetByID(id int64) (entity.Customer, bool) {
	if r.store == nil || r.store.DB == nil {
		return entity.Customer{}, false
	}

	var customer entity.Customer
	if err := r.store.DB.First(&customer, id).Error; err != nil {
		return entity.Customer{}, false
	}

	return customer, true
}

func (r *customerRepository) Create(customer entity.Customer) entity.Customer {
	if r.store == nil || r.store.DB == nil {
		return customer
	}

	_ = r.store.DB.Create(&customer)
	return customer
}

func (r *customerRepository) Update(id int64, customer entity.Customer) (entity.Customer, bool) {
	if r.store == nil || r.store.DB == nil {
		return entity.Customer{}, false
	}

	customer.ID = id
	result := r.store.DB.Model(&entity.Customer{}).Where("id = ?", id).Updates(map[string]any{"name": customer.Name})
	if result.Error != nil || result.RowsAffected == 0 {
		return entity.Customer{}, false
	}

	return customer, true
}

func (r *customerRepository) Delete(id int64) bool {
	if r.store == nil || r.store.DB == nil {
		return false
	}

	result := r.store.DB.Delete(&entity.Customer{}, id)
	return result.Error == nil && result.RowsAffected > 0
}