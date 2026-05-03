package controller

import (
	"net/http"

	"github.com/labstack/echo/v4"

	"sava-io-webapp/backend/internal/model/request"
	"sava-io-webapp/backend/internal/model/response"
	"sava-io-webapp/backend/internal/service"
)

type AuthController struct {
	service service.AuthService
}

func NewAuthController(service service.AuthService) *AuthController {
	return &AuthController{service: service}
}

func (ctrl *AuthController) Routes(e *echo.Echo) {
	group := e.Group("/api/auth")
	group.POST("/login", ctrl.Login)
}

func (ctrl *AuthController) Login(c echo.Context) error {
	var payload request.LoginRequest
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: "invalid request payload"})
	}

	result, err := ctrl.service.Login(payload)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, response.MessageResponse{Message: err.Error()})
	}

	return c.JSON(http.StatusOK, result)
}