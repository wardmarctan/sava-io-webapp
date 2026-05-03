package service

import (
	"fmt"

	"sava-io-webapp/backend/internal/entity"
	"sava-io-webapp/backend/internal/model/request"
	"sava-io-webapp/backend/internal/model/response"
	"sava-io-webapp/backend/internal/repository"
	"golang.org/x/text/language"
	"golang.org/x/text/message"
)

type accountService struct {
	repo repository.AccountRepository
}

func NewAccountService(repo repository.AccountRepository) AccountService {
	return &accountService{repo: repo}
}

func toAccountResponse(acc entity.Account) response.AccountResponse {
	p := message.NewPrinter(language.Indonesian)
	updatedAt := "-"
	if acc.UpdatedAt.Sub(acc.CreatedAt).Seconds() > 1 {
		updatedAt = acc.UpdatedAt.Format("02 Jan 2006 15:04:05")
	}

	return response.AccountResponse{
		ID:             acc.ID,
		AccountID:      fmt.Sprintf("ACC-%03d", acc.ID),
		Customer:       acc.Customer.Name,
		CustomerID:     acc.CustomerID,
		DepositoType:   acc.DepositoType.Name,
		DepositoTypeID: acc.DepositoTypeID,
		CreatedAt:      acc.CreatedAt.Format("02 Jan 2006 15:04:05"),
		UpdatedAt:      updatedAt,
		Balance:        p.Sprintf("Rp %.0f", acc.Balance),
		BalanceRaw:     acc.Balance,
	}
}

func (s *accountService) List() []response.AccountResponse {
	entities := s.repo.List()
	res := make([]response.AccountResponse, len(entities))
	for i, acc := range entities {
		res[i] = toAccountResponse(acc)
	}
	return res
}

func (s *accountService) GetByID(id int64) (response.AccountResponse, bool) {
	acc, ok := s.repo.GetByID(id)
	if !ok {
		return response.AccountResponse{}, false
	}
	return toAccountResponse(acc), true
}

func (s *accountService) Create(req *request.AccountRequest) response.AccountResponse {
	acc := &entity.Account{
		CustomerID:     req.CustomerID,
		DepositoTypeID: req.DepositoTypeID,
		Balance:        req.Balance,
	}
	saved := s.repo.Create(acc)
	return toAccountResponse(saved)
}

func (s *accountService) Update(id int64, req *request.AccountRequest) (response.AccountResponse, bool) {
	acc, ok := s.repo.GetByID(id)
	if !ok {
		return response.AccountResponse{}, false
	}
	
	acc.CustomerID = req.CustomerID
	acc.DepositoTypeID = req.DepositoTypeID
	acc.Balance = req.Balance

	updated, ok := s.repo.Update(&acc)
	if !ok {
		return response.AccountResponse{}, false
	}
	return toAccountResponse(updated), true
}

func (s *accountService) Delete(id int64) bool {
	return s.repo.Delete(id)
}