package response

type TransactionResponse struct {
	ID              int64    `json:"id"`
	AccountID       string   `json:"account_id"`
	AccountIDRaw    int64    `json:"account_id_raw"`
	Customer        string   `json:"customer"`
	DepositoType    string   `json:"deposito_type"`
	TransactionType string   `json:"transaction_type"`
	Amount          string   `json:"amount"`
	AmountRaw       float64  `json:"amount_raw"`
	TransactionDate string   `json:"transaction_date"`
	StartingBalance string   `json:"starting_balance"`
	StartingRaw     float64  `json:"starting_balance_raw"`
	EndingBalance   string   `json:"ending_balance"`
	EndingRaw       float64  `json:"ending_balance_raw"`
	YearlyReturn    float64  `json:"yearly_return"`
	MonthlyReturn   float64  `json:"monthly_return"`
	ReturnAmount    *string  `json:"return_amount,omitempty"`
	ReturnRaw       *float64 `json:"return_amount_raw,omitempty"`
	Months          *int     `json:"months,omitempty"`
}

