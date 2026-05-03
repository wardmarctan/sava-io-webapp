package request

type TransactionRequest struct {
	ID              int64   `json:"id"`
	AccountID       int64   `json:"account_id"`
	TransactionType string  `json:"transaction_type"`
	Amount          float64 `json:"amount"`
	// ISO date string from frontend, e.g. "2026-04-30"
	TransactionDate string `json:"transaction_date"`
	Months          *int   `json:"months,omitempty"`
}

