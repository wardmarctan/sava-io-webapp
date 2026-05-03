package service

import (
	"sava-io-webapp/backend/internal/entity"
	"sava-io-webapp/backend/internal/repository"
)

type customerService struct {
	repo repository.CustomerRepository
}

func NewCustomerService(repo repository.CustomerRepository) CustomerService {
	return &customerService{repo: repo}
}

func (s *customerService) List() []entity.Customer {
	return s.repo.List()
}

func (s *customerService) GetByID(id int64) (entity.Customer, bool) {
	return s.repo.GetByID(id)
}

func (s *customerService) Create(name string) entity.Customer {
	return s.repo.Create(entity.Customer{Name: name})
}

func (s *customerService) Update(id int64, name string) (entity.Customer, bool) {
	return s.repo.Update(id, entity.Customer{Name: name})
}

func (s *customerService) Delete(id int64) bool {
	return s.repo.Delete(id)
}