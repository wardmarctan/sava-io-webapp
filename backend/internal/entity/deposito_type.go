package entity

type DepositoType struct {
	ID           int64   `json:"id" gorm:"primaryKey;autoIncrement"`
	Name         string  `json:"name" gorm:"not null"`
	YearlyReturn float64 `json:"yearly_return" gorm:"not null"`
}