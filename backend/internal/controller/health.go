package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type HealthController struct{}

func NewHealthController() *HealthController {
	return &HealthController{}
}

func (ctrl *HealthController) Routes(e *echo.Echo) {
	e.GET("/api/health", ctrl.Health)
}

func (ctrl *HealthController) Health(c echo.Context) error {
	return c.JSON(http.StatusOK, echo.Map{
		"status":  "ok",
		"service": "sava-io-webapp",
	})
}