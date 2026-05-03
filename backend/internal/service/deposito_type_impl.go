package service

import (
	"sava-io-webapp/backend/internal/entity"
	"sava-io-webapp/backend/internal/repository"
)

type depositoTypeService struct {
	repo repository.DepositoTypeRepository
}

func NewDepositoTypeService(repo repository.DepositoTypeRepository) DepositoTypeService {
	return &depositoTypeService{repo: repo}
}

func (s *depositoTypeService) List() []entity.DepositoType {
	return s.repo.List()
}

func (s *depositoTypeService) GetByID(id int64) (entity.DepositoType, bool) {
	return s.repo.GetByID(id)
}

func (s *depositoTypeService) Create(name string, yearlyReturn float64) entity.DepositoType {
	return s.repo.Create(entity.DepositoType{Name: name, YearlyReturn: yearlyReturn})
}

func (s *depositoTypeService) Update(id int64, name string, yearlyReturn float64) (entity.DepositoType, bool) {
	return s.repo.Update(id, entity.DepositoType{Name: name, YearlyReturn: yearlyReturn})
}

func (s *depositoTypeService) Delete(id int64) bool {
	return s.repo.Delete(id)
}