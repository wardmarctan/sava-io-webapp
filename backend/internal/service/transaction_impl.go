package service

import (
	"sava-io-webapp/backend/internal/entity"
	"sava-io-webapp/backend/internal/repository"
)

type transactionService struct {
	repo repository.TransactionRepository
}

func NewTransactionService(repo repository.TransactionRepository) TransactionService {
	return &transactionService{repo: repo}
}

func (s *transactionService) List() []entity.Transaction {
	return s.repo.List()
}