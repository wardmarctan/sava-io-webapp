package entity

import "time"

type Account struct {
	ID            int64     `json:"id"`
	CustomerID    int64     `json:"customer_id"`
	DepositoTypeID int64     `json:"deposito_type_id"`
	Balance       float64   `json:"balance"`
	OpenedAt      time.Time `json:"opened_at"`
}