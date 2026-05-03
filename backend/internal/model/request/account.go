package request

type AccountRequest struct {
	ID             int64   `json:"id"`
	CustomerID     int64   `json:"customer_id"`
	DepositoTypeID int64   `json:"deposito_type_id"`
	Balance        float64 `json:"balance"`
}
