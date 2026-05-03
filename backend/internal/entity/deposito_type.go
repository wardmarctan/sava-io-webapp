package entity

type DepositoType struct {
	ID           int64   `json:"id"`
	Name         string  `json:"name"`
	YearlyReturn float64 `json:"yearly_return"`
}