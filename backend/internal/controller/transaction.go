package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"

	"sava-io-webapp/backend/internal/model/request"
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
	group := e.Group("/api/transactions")
	group.POST("/list", ctrl.List)
	group.POST("/get", ctrl.Get)
	group.POST("/create", ctrl.Create)
}

func (ctrl *TransactionController) List(c echo.Context) error {
	var payload request.TransactionRequest
	_ = c.Bind(&payload)
	var accountID *int64
	if payload.AccountID != 0 {
		accountID = &payload.AccountID
	}
	data := ctrl.service.List(accountID)
	return c.JSON(http.StatusOK, response.ListResponse[any]{Data: toAnySlice(data), Total: len(data)})
}

func (ctrl *TransactionController) Get(c echo.Context) error {
	var payload request.TransactionRequest
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: "invalid transaction id"})
	}
	if payload.ID == 0 {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: "invalid transaction id"})
	}

	tx, ok := ctrl.service.GetByID(payload.ID)
	if !ok {
		return c.JSON(http.StatusNotFound, response.MessageResponse{Message: "transaction not found"})
	}
	return c.JSON(http.StatusOK, tx)
}

func (ctrl *TransactionController) Create(c echo.Context) error {
	var payload request.TransactionRequest
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: "invalid request payload"})
	}

	tx, ok, msg := ctrl.service.Create(&payload)
	if !ok {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: msg})
	}
	return c.JSON(http.StatusCreated, tx)
}