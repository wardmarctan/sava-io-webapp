package service

import (
	"fmt"
	"time"

	"sava-io-webapp/backend/internal/entity"
	"sava-io-webapp/backend/internal/model/request"
	"sava-io-webapp/backend/internal/model/response"
	"sava-io-webapp/backend/internal/repository"
	"golang.org/x/text/language"
	"golang.org/x/text/message"
)

type transactionService struct {
	repo repository.TransactionRepository
	accountRepo repository.AccountRepository
}

func NewTransactionService(repo repository.TransactionRepository, accountRepo repository.AccountRepository) TransactionService {
	return &transactionService{repo: repo, accountRepo: accountRepo}
}

func toTransactionResponse(tx entity.Transaction) response.TransactionResponse {
	p := message.NewPrinter(language.Indonesian)

	yearly := tx.Account.DepositoType.YearlyReturn
	monthly := yearly / 12.0

	var returnAmountStr *string
	var returnAmountRaw *float64
	if tx.ReturnAmount != nil {
		text := p.Sprintf("Rp %.0f", *tx.ReturnAmount)
		returnAmountStr = &text
		returnAmountRaw = tx.ReturnAmount
	}

	return response.TransactionResponse{
		ID:              tx.ID,
		AccountID:       fmt.Sprintf("ACC-%03d", tx.AccountID),
		AccountIDRaw:    tx.AccountID,
		Customer:        tx.Account.Customer.Name,
		DepositoType:    tx.Account.DepositoType.Name,
		TransactionType: tx.TransactionType,
		Amount:          p.Sprintf("Rp %.0f", tx.Amount),
		AmountRaw:       tx.Amount,
		TransactionDate: tx.TransactionDate.Format("02 Jan 2006 15:04"),
		StartingBalance: p.Sprintf("Rp %.0f", tx.StartingBalance),
		StartingRaw:     tx.StartingBalance,
		EndingBalance:   p.Sprintf("Rp %.0f", tx.EndingBalance),
		EndingRaw:       tx.EndingBalance,
		YearlyReturn:    yearly,
		MonthlyReturn:   monthly,
		ReturnAmount:    returnAmountStr,
		ReturnRaw:       returnAmountRaw,
		Months:          tx.Months,
	}
}

func (s *transactionService) List(accountID *int64) []response.TransactionResponse {
	entities := s.repo.List(accountID)
	res := make([]response.TransactionResponse, len(entities))
	for i, tx := range entities {
		res[i] = toTransactionResponse(tx)
	}
	return res
}

func (s *transactionService) GetByID(id int64) (response.TransactionResponse, bool) {
	tx, ok := s.repo.GetByID(id)
	if !ok {
		return response.TransactionResponse{}, false
	}
	return toTransactionResponse(tx), true
}

func (s *transactionService) Create(req *request.TransactionRequest) (response.TransactionResponse, bool, string) {
	if req == nil {
		return response.TransactionResponse{}, false, "invalid request payload"
	}
	if req.AccountID == 0 {
		return response.TransactionResponse{}, false, "account is required"
	}
	if req.TransactionType != "deposit" && req.TransactionType != "withdraw" {
		return response.TransactionResponse{}, false, "invalid transaction type"
	}
	if req.Amount <= 0 {
		return response.TransactionResponse{}, false, "amount must be greater than 0"
	}

	txDate, err := time.Parse("2006-01-02", req.TransactionDate)
	if err != nil {
		return response.TransactionResponse{}, false, "invalid transaction date"
	}

	acc, ok := s.accountRepo.GetByID(req.AccountID)
	if !ok {
		return response.TransactionResponse{}, false, "account not found"
	}

	starting := acc.Balance
	var ending float64
	var months *int
	var returnAmount *float64

	if req.TransactionType == "deposit" {
		ending = starting + req.Amount
	} else {
		m := 0
		if req.Months != nil {
			m = *req.Months
		}
		if m <= 0 {
			return response.TransactionResponse{}, false, "months must be greater than 0"
		}
		months = &m
		monthlyRate := (acc.DepositoType.YearlyReturn / 12.0) / 100.0
		ret := starting * float64(m) * monthlyRate
		returnAmount = &ret
		ending = starting + ret - req.Amount
		if ending < 0 {
			return response.TransactionResponse{}, false, "insufficient balance"
		}
	}

	newTx := &entity.Transaction{
		AccountID:       req.AccountID,
		TransactionType: req.TransactionType,
		Amount:          req.Amount,
		TransactionDate: txDate,
		StartingBalance: starting,
		EndingBalance:   ending,
		ReturnAmount:    returnAmount,
		Months:          months,
	}
	saved := s.repo.Create(newTx)

	acc.Balance = ending
	_, _ = s.accountRepo.Update(&acc)

	loaded, loadedOk := s.repo.GetByID(saved.ID)
	if !loadedOk {
		return response.TransactionResponse{}, false, "failed to load transaction"
	}
	return toTransactionResponse(loaded), true, ""
}