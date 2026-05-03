package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"sava-io-webapp/backend/internal/config"
	"sava-io-webapp/backend/internal/controller"
	"sava-io-webapp/backend/internal/repository"
	"sava-io-webapp/backend/internal/service"
)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	appConfig := config.Load()
	config.LoadDatabaseConfig()
	db := config.ConnectDatabase()
	store := repository.NewStore(db)

	e := echo.New()
	e.HideBanner = true
	e.Use(middleware.Recover())
	e.Use(middleware.Logger())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     splitAndTrim(appConfig.CORSOrigins),
		AllowMethods:     []string{echo.GET, echo.POST, echo.PUT, echo.PATCH, echo.DELETE, echo.OPTIONS},
		AllowHeaders:     []string{echo.HeaderContentType, echo.HeaderAuthorization},
		AllowCredentials: false,
	}))

	userRepository := repository.NewUserRepository(store)
	authService := service.NewAuthService(userRepository)
	authController := controller.NewAuthController(authService)
	healthController := controller.NewHealthController()
	customerController := controller.NewCustomerController(service.NewCustomerService(repository.NewCustomerRepository(store)))
	accountController := controller.NewAccountController(service.NewAccountService(repository.NewAccountRepository(store)))
	depositoTypeController := controller.NewDepositoTypeController(service.NewDepositoTypeService(repository.NewDepositoTypeRepository(store)))
	transactionController := controller.NewTransactionController(service.NewTransactionService(repository.NewTransactionRepository(store), repository.NewAccountRepository(store)))

	authController.Routes(e)
	healthController.Routes(e)
	customerController.Routes(e)
	accountController.Routes(e)
	depositoTypeController.Routes(e)
	transactionController.Routes(e)

	errCh := make(chan error, 1)
	go func() {
		if err := e.Start(appConfig.Address()); err != nil {
			if !errors.Is(err, http.ErrServerClosed) {
				errCh <- err
			}
		}
	}()

	select {
	case err := <-errCh:
		if err != nil {
			log.Fatal(err)
		}
	case <-ctx.Done():
		if err := e.Shutdown(context.Background()); err != nil {
			log.Fatal(err)
		}
	}

	sqlDB, err := db.DB()
	if err == nil {
		_ = sqlDB.Close()
	}
}

func splitAndTrim(value string) []string {
	if strings.TrimSpace(value) == "" {
		return []string{"http://localhost:5173"}
	}

	items := strings.Split(value, ",")
	result := make([]string, 0, len(items))
	for _, item := range items {
		trimmed := strings.TrimSpace(item)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}

	if len(result) == 0 {
		return []string{"http://localhost:5173"}
	}

	return result
}