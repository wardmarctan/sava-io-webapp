package response

type AccountResponse struct {
	ID             int64     `json:"id"`
	AccountID      string    `json:"account_id"`
	Customer       string    `json:"customer"`
	CustomerID     int64     `json:"customer_id"`
	DepositoType   string    `json:"deposito_type"`
	DepositoTypeID int64     `json:"deposito_type_id"`
	CreatedAt      string    `json:"created_at"`
	UpdatedAt      string    `json:"updated_at"`
	Balance        string    `json:"balance"`
	BalanceRaw     float64   `json:"balance_raw"`
}
