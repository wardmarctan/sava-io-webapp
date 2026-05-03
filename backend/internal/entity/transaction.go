package entity

import "time"

type Transaction struct {
	ID              int64      `json:"id"`
	AccountID       int64      `json:"account_id"`
	TransactionType string     `json:"transaction_type"`
	Amount          float64    `json:"amount"`
	TransactionDate time.Time  `json:"transaction_date"`
	StartingBalance float64    `json:"starting_balance"`
	EndingBalance   float64    `json:"ending_balance"`
	ReturnAmount    *float64   `json:"return_amount,omitempty"`
	Months          *int       `json:"months,omitempty"`
}