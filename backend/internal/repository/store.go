package repository

import (
	"time"

	"sava-io-webapp/backend/internal/entity"
)

type Store struct {
	Customers     []entity.Customer
	Accounts      []entity.Account
	DepositoTypes  []entity.DepositoType
	Transactions  []entity.Transaction
	Users         map[string]entity.User
}

func NewStore() *Store {
	return &Store{
		Customers: []entity.Customer{
			{ID: 1, Name: "Budi Santoso"},
			{ID: 2, Name: "Siti Aminah"},
			{ID: 3, Name: "Jane Doe"},
			{ID: 4, Name: "Dewi Lestari"},
			{ID: 5, Name: "John Doe"},
		},
		DepositoTypes: []entity.DepositoType{
			{ID: 1, Name: "Deposito Bronze", YearlyReturn: 3},
			{ID: 2, Name: "Deposito Silver", YearlyReturn: 5},
			{ID: 3, Name: "Deposito Gold", YearlyReturn: 7},
		},
		Accounts: []entity.Account{
			{ID: 1, CustomerID: 1, DepositoTypeID: 3, Balance: 150000000, OpenedAt: mustParseDate("2026-04-30")},
			{ID: 2, CustomerID: 2, DepositoTypeID: 2, Balance: 75000000, OpenedAt: mustParseDate("2026-02-15")},
			{ID: 3, CustomerID: 3, DepositoTypeID: 1, Balance: 55000000, OpenedAt: mustParseDate("2025-03-19")},
			{ID: 4, CustomerID: 4, DepositoTypeID: 3, Balance: 30000000, OpenedAt: mustParseDate("2025-08-18")},
			{ID: 5, CustomerID: 5, DepositoTypeID: 2, Balance: 71500000, OpenedAt: mustParseDate("2026-01-17")},
		},
		Transactions: []entity.Transaction{
			{ID: 1, AccountID: 1, TransactionType: "WITHDRAW", Amount: 10000000, TransactionDate: mustParseDate("2026-04-30"), StartingBalance: 160000000, EndingBalance: 150000000, ReturnAmount: float64Ptr(0), Months: intPtr(3)},
			{ID: 2, AccountID: 2, TransactionType: "DEPOSIT", Amount: 5000000, TransactionDate: mustParseDate("2026-04-30"), StartingBalance: 70000000, EndingBalance: 75000000},
			{ID: 3, AccountID: 3, TransactionType: "DEPOSIT", Amount: 3000000, TransactionDate: mustParseDate("2026-04-30"), StartingBalance: 52000000, EndingBalance: 55000000},
			{ID: 4, AccountID: 4, TransactionType: "WITHDRAW", Amount: 15000000, TransactionDate: mustParseDate("2026-04-30"), StartingBalance: 45000000, EndingBalance: 30770000, ReturnAmount: float64Ptr(770000), Months: intPtr(6)},
			{ID: 5, AccountID: 5, TransactionType: "WITHDRAW", Amount: 20000000, TransactionDate: mustParseDate("2026-04-30"), StartingBalance: 140000000, EndingBalance: 120000000},
		},
		Users: map[string]entity.User{
			"admin": {
				ID:       1,
				Username: "admin",
				Password: "123456",
				Role:     "admin",
			},
		},
	}
}

func mustParseDate(value string) time.Time {
	parsed, _ := time.Parse("2006-01-02", value)
	return parsed
}

func float64Ptr(value float64) *float64 {
	return &value
}

func intPtr(value int) *int {
	return &value
}