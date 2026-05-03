package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"

	"sava-io-webapp/backend/internal/model/response"
	"sava-io-webapp/backend/internal/service"
)

type AccountController struct {
	service service.AccountService
}

func NewAccountController(service service.AccountService) *AccountController {
	return &AccountController{service: service}
}

func (ctrl *AccountController) Routes(e *echo.Echo) {
	e.GET("/api/accounts", ctrl.List)
}

func (ctrl *AccountController) List(c echo.Context) error {
	data := ctrl.service.List()
	return c.JSON(http.StatusOK, response.ListResponse[any]{Data: toAnySlice(data), Total: len(data)})
}