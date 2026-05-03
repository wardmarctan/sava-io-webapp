package controller

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"

	"sava-io-webapp/backend/internal/model/request"
	"sava-io-webapp/backend/internal/model/response"
	"sava-io-webapp/backend/internal/service"
)

type DepositoTypeController struct {
	service service.DepositoTypeService
}

const (
	depositoTypeInvalidIDMessage   = "invalid deposito type id"
	depositoTypeNotFoundMessage    = "deposito type not found"
	depositoTypeInvalidBodyMessage = "invalid request payload"
	depositoTypeNameRequired       = "deposito type name is required"
)

func NewDepositoTypeController(service service.DepositoTypeService) *DepositoTypeController {
	return &DepositoTypeController{service: service}
}

func (ctrl *DepositoTypeController) Routes(e *echo.Echo) {
	e.GET("/api/deposito-types", ctrl.List)
	group := e.Group("/api/deposito-types")
	group.POST("/get", ctrl.Get)
	group.POST("/create", ctrl.Create)
	group.POST("/update", ctrl.Update)
	group.POST("/delete", ctrl.Delete)
}

func (ctrl *DepositoTypeController) List(c echo.Context) error {
	data := ctrl.service.List()
	return c.JSON(http.StatusOK, response.ListResponse[any]{Data: toAnySlice(data), Total: len(data)})
}

func (ctrl *DepositoTypeController) Get(c echo.Context) error {
	var payload request.DepositoTypeRequest
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: depositoTypeInvalidIDMessage})
	}

	dt, ok := ctrl.service.GetByID(payload.ID)
	if !ok {
		return c.JSON(http.StatusNotFound, response.MessageResponse{Message: depositoTypeNotFoundMessage})
	}

	return c.JSON(http.StatusOK, dt)
}

func (ctrl *DepositoTypeController) Create(c echo.Context) error {
	var payload request.DepositoTypeRequest
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: depositoTypeInvalidBodyMessage})
	}

	name := strings.TrimSpace(payload.Name)
	if name == "" {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: depositoTypeNameRequired})
	}

	dt := ctrl.service.Create(name, payload.YearlyReturn)
	return c.JSON(http.StatusCreated, dt)
}

func (ctrl *DepositoTypeController) Update(c echo.Context) error {
	var payload request.DepositoTypeRequest
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: depositoTypeInvalidBodyMessage})
	}

	if payload.ID == 0 {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: depositoTypeInvalidIDMessage})
	}

	name := strings.TrimSpace(payload.Name)
	if name == "" {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: depositoTypeNameRequired})
	}

	dt, ok := ctrl.service.Update(payload.ID, name, payload.YearlyReturn)
	if !ok {
		return c.JSON(http.StatusNotFound, response.MessageResponse{Message: depositoTypeNotFoundMessage})
	}

	return c.JSON(http.StatusOK, dt)
}

func (ctrl *DepositoTypeController) Delete(c echo.Context) error {
	var payload request.DepositoTypeRequest
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: depositoTypeInvalidIDMessage})
	}

	if payload.ID == 0 {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: depositoTypeInvalidIDMessage})
	}

	dt, ok := ctrl.service.GetByID(payload.ID)
	if !ok {
		return c.JSON(http.StatusNotFound, response.MessageResponse{Message: depositoTypeNotFoundMessage})
	}

	if !ctrl.service.Delete(dt.ID) {
		return c.JSON(http.StatusConflict, response.MessageResponse{Message: "deposito type is currently in use and cannot be deleted"})
	}

	return c.NoContent(http.StatusNoContent)
}
