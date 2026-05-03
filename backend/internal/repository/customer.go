package repository

import "sava-io-webapp/backend/internal/entity"

type CustomerRepository interface {
	List() []entity.Customer
	GetByID(id int64) (entity.Customer, bool)
	Create(customer entity.Customer) entity.Customer
	Update(id int64, customer entity.Customer) (entity.Customer, bool)
	Delete(id int64) bool
}