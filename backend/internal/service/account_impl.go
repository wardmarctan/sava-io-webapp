package service

import (
	"sava-io-webapp/backend/internal/entity"
	"sava-io-webapp/backend/internal/repository"
)

type accountService struct {
	repo repository.AccountRepository
}

func NewAccountService(repo repository.AccountRepository) AccountService {
	return &accountService{repo: repo}
}

func (s *accountService) List() []entity.Account {
	return s.repo.List()
}