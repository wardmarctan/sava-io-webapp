package entity

import "time"

type Account struct {
	ID             int64     `json:"id" gorm:"primaryKey;autoIncrement"`
	CustomerID     int64     `json:"customer_id" gorm:"not null;index"`
	DepositoTypeID int64     `json:"deposito_type_id" gorm:"not null;index"`
	Balance        float64   `json:"balance" gorm:"not null"`
	OpenedAt       time.Time `json:"opened_at" gorm:"not null"`
}