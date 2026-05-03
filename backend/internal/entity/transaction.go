package entity

import "time"

type Transaction struct {
	ID              int64      `json:"id" gorm:"primaryKey;autoIncrement"`
	AccountID       int64      `json:"account_id" gorm:"not null;index"`
	TransactionType string     `json:"transaction_type" gorm:"not null"`
	Amount          float64    `json:"amount" gorm:"not null"`
	TransactionDate time.Time  `json:"transaction_date" gorm:"not null"`
	StartingBalance float64    `json:"starting_balance" gorm:"not null"`
	EndingBalance   float64    `json:"ending_balance" gorm:"not null"`
	ReturnAmount    *float64   `json:"return_amount,omitempty"`
	Months          *int       `json:"months,omitempty"`
}