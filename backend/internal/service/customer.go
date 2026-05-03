package service

import "sava-io-webapp/backend/internal/entity"

type CustomerService interface {
	List() []entity.Customer
	GetByID(id int64) (entity.Customer, bool)
	Create(name string) entity.Customer
	Update(id int64, name string) (entity.Customer, bool)
	Delete(id int64) bool
}