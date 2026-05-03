package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"

	"sava-io-webapp/backend/internal/model/request"
	"sava-io-webapp/backend/internal/model/response"
	"sava-io-webapp/backend/internal/service"
)

const (
	accountInvalidIDMessage   = "invalid account id"
	accountNotFoundMessage    = "account not found"
	accountInvalidBodyMessage = "invalid request payload"
)

type AccountController struct {
	service service.AccountService
}

func NewAccountController(service service.AccountService) *AccountController {
	return &AccountController{service: service}
}

func (ctrl *AccountController) Routes(e *echo.Echo) {
	group := e.Group("/api/accounts")
	group.POST("/list", ctrl.List)
	group.POST("/get", ctrl.Get)
	group.POST("/create", ctrl.Create)
	group.POST("/update", ctrl.Update)
	group.POST("/delete", ctrl.Delete)
}

func (ctrl *AccountController) List(c echo.Context) error {
	data := ctrl.service.List()
	return c.JSON(http.StatusOK, response.ListResponse[any]{Data: toAnySlice(data), Total: len(data)})
}

func (ctrl *AccountController) Get(c echo.Context) error {
	var payload request.AccountRequest
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: accountInvalidIDMessage})
	}

	account, ok := ctrl.service.GetByID(payload.ID)
	if !ok {
		return c.JSON(http.StatusNotFound, response.MessageResponse{Message: accountNotFoundMessage})
	}

	return c.JSON(http.StatusOK, account)
}

func (ctrl *AccountController) Create(c echo.Context) error {
	var payload request.AccountRequest
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: accountInvalidBodyMessage})
	}

	if payload.CustomerID == 0 || payload.DepositoTypeID == 0 {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: "customer and deposito type are required"})
	}

	account := ctrl.service.Create(&payload)
	return c.JSON(http.StatusCreated, account)
}

func (ctrl *AccountController) Update(c echo.Context) error {
	var payload request.AccountRequest
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: accountInvalidBodyMessage})
	}

	if payload.ID == 0 {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: accountInvalidIDMessage})
	}

	if payload.CustomerID == 0 || payload.DepositoTypeID == 0 {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: "customer and deposito type are required"})
	}

	account, ok := ctrl.service.Update(payload.ID, &payload)
	if !ok {
		return c.JSON(http.StatusNotFound, response.MessageResponse{Message: accountNotFoundMessage})
	}

	return c.JSON(http.StatusOK, account)
}

func (ctrl *AccountController) Delete(c echo.Context) error {
	var payload request.AccountRequest
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: accountInvalidIDMessage})
	}

	if !ctrl.service.Delete(payload.ID) {
		return c.JSON(http.StatusNotFound, response.MessageResponse{Message: accountNotFoundMessage})
	}

	return c.NoContent(http.StatusNoContent)
}