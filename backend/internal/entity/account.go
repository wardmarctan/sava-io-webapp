package entity

import "time"

type Account struct {
	ID             int64     `json:"id" gorm:"primaryKey;autoIncrement"`
	CustomerID     int64     `json:"customer_id" gorm:"not null;index"`
	DepositoTypeID int64     `json:"deposito_type_id" gorm:"not null;index"`
	Balance        float64      `json:"balance" gorm:"not null"`
	CreatedAt      time.Time    `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt      time.Time    `json:"updated_at" gorm:"autoUpdateTime"`
	Customer       Customer     `json:"customer" gorm:"foreignKey:CustomerID"`
	DepositoType   DepositoType `json:"deposito_type" gorm:"foreignKey:DepositoTypeID"`
}