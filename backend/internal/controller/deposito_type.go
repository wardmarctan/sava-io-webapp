package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"

	"sava-io-webapp/backend/internal/model/response"
	"sava-io-webapp/backend/internal/service"
)

type DepositoTypeController struct {
	service service.DepositoTypeService
}

func NewDepositoTypeController(service service.DepositoTypeService) *DepositoTypeController {
	return &DepositoTypeController{service: service}
}

func (ctrl *DepositoTypeController) Routes(e *echo.Echo) {
	e.GET("/api/deposito-types", ctrl.List)
}

func (ctrl *DepositoTypeController) List(c echo.Context) error {
	data := ctrl.service.List()
	return c.JSON(http.StatusOK, response.ListResponse[any]{Data: toAnySlice(data), Total: len(data)})
}