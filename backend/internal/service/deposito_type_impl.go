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