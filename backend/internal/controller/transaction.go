package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"

	"sava-io-webapp/backend/internal/model/response"
	"sava-io-webapp/backend/internal/service"
)

type TransactionController struct {
	service service.TransactionService
}

func NewTransactionController(service service.TransactionService) *TransactionController {
	return &TransactionController{service: service}
}

func (ctrl *TransactionController) Routes(e *echo.Echo) {
	e.GET("/api/transactions", ctrl.List)
}

func (ctrl *TransactionController) List(c echo.Context) error {
	data := ctrl.service.List()
	return c.JSON(http.StatusOK, response.ListResponse[any]{Data: toAnySlice(data), Total: len(data)})
}