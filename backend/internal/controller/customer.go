package controller

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"

	"sava-io-webapp/backend/internal/model/request"
	"sava-io-webapp/backend/internal/model/response"
	"sava-io-webapp/backend/internal/service"
)

type CustomerController struct {
	service service.CustomerService
}

const (
	customerInvalidIDMessage   = "invalid customer id"
	customerNotFoundMessage    = "customer not found"
	customerInvalidBodyMessage = "invalid request payload"
	customerNameRequired       = "customer name is required"
)

func NewCustomerController(service service.CustomerService) *CustomerController {
	return &CustomerController{service: service}
}

func (ctrl *CustomerController) Routes(e *echo.Echo) {
	group := e.Group("/api/customers")
	group.GET("", ctrl.List)
	group.GET("/:id", ctrl.Get)
	group.POST("", ctrl.Create)
	group.PUT("/:id", ctrl.Update)
	group.DELETE("/:id", ctrl.Delete)
}

func (ctrl *CustomerController) List(c echo.Context) error {
	data := ctrl.service.List()
	return c.JSON(http.StatusOK, response.ListResponse[any]{Data: toAnySlice(data), Total: len(data)})
}

func (ctrl *CustomerController) Get(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: customerInvalidIDMessage})
	}

	customer, ok := ctrl.service.GetByID(id)
	if !ok {
		return c.JSON(http.StatusNotFound, response.MessageResponse{Message: customerNotFoundMessage})
	}

	return c.JSON(http.StatusOK, customer)
}

func (ctrl *CustomerController) Create(c echo.Context) error {
	var payload request.CustomerRequest
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: customerInvalidBodyMessage})
	}

	if payload.Name == "" {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: customerNameRequired})
	}

	customer := ctrl.service.Create(payload.Name)
	return c.JSON(http.StatusCreated, customer)
}

func (ctrl *CustomerController) Update(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: "invalid customer id"})
	}

	var payload request.CustomerRequest
	if err := c.Bind(&payload); err != nil {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: customerInvalidBodyMessage})
	}

	if payload.Name == "" {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: customerNameRequired})
	}

	customer, ok := ctrl.service.Update(id, payload.Name)
	if !ok {
		return c.JSON(http.StatusNotFound, response.MessageResponse{Message: customerNotFoundMessage})
	}

	return c.JSON(http.StatusOK, customer)
}

func (ctrl *CustomerController) Delete(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, response.MessageResponse{Message: customerInvalidIDMessage})
	}

	if !ctrl.service.Delete(id) {
		return c.JSON(http.StatusNotFound, response.MessageResponse{Message: customerNotFoundMessage})
	}

	return c.NoContent(http.StatusNoContent)
}

func toAnySlice[T any](values []T) []any {
	result := make([]any, len(values))
	for index, value := range values {
		result[index] = value
	}
	return result
}