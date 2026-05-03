package repository

import (
	"fmt"
	"time"

	"gorm.io/gorm"

	"sava-io-webapp/backend/internal/entity"
)

type Store struct {
	DB *gorm.DB
}

func NewStore(db *gorm.DB) *Store {
	SeedDatabase(db)
	return &Store{DB: db}
}

func SeedDatabase(db *gorm.DB) {
	if db == nil {
		return
	}
	if err := db.Migrator().DropTable(&entity.Transaction{}, &entity.Account{}); err != nil {
		fmt.Println("Error dropping tables:", err)
	}

	if err := db.AutoMigrate(
		&entity.User{},
		&entity.Customer{},
		&entity.DepositoType{},
		&entity.Account{},
		&entity.Transaction{},
	); err != nil {
		panic(err)
	}

	seedUsers(db)
	seedCustomers(db)
	seedDepositoTypes(db)
	seedAccounts(db)
	seedTransactions(db)
	resetSequence(db, "users")
	resetSequence(db, "customers")
	resetSequence(db, "deposito_types")
	resetSequence(db, "accounts")
	resetSequence(db, "transactions")
}

func seedUsers(db *gorm.DB) {
	user := entity.User{ID: 1, Username: "admin", Password: "123456", Role: "admin"}
	var count int64
	db.Model(&entity.User{}).Where("username = ?", user.Username).Count(&count)
	if count == 0 {
		db.Create(&user)
	}
}

func seedCustomers(db *gorm.DB) {
	customers := []entity.Customer{{ID: 1, Name: "Budi Santoso"}, {ID: 2, Name: "Siti Aminah"}, {ID: 3, Name: "Jane Doe"}, {ID: 4, Name: "Dewi Lestari"}, {ID: 5, Name: "John Doe"}}
	for _, customer := range customers {
		var count int64
		db.Model(&entity.Customer{}).Where("id = ?", customer.ID).Count(&count)
		if count == 0 {
			db.Create(&customer)
		}
	}
}

func seedDepositoTypes(db *gorm.DB) {
	types := []entity.DepositoType{{ID: 1, Name: "Deposito Bronze", YearlyReturn: 3}, {ID: 2, Name: "Deposito Silver", YearlyReturn: 5}, {ID: 3, Name: "Deposito Gold", YearlyReturn: 7}}
	for _, item := range types {
		var count int64
		db.Model(&entity.DepositoType{}).Where("id = ?", item.ID).Count(&count)
		if count == 0 {
			db.Create(&item)
		}
	}
}

func seedAccounts(db *gorm.DB) {
	accounts := []entity.Account{
		{ID: 1, CustomerID: 1, DepositoTypeID: 3, Balance: 150000000, CreatedAt: mustParseDate("2026-04-30"), UpdatedAt: mustParseDate("2026-04-30")},
		{ID: 2, CustomerID: 2, DepositoTypeID: 2, Balance: 75000000, CreatedAt: mustParseDate("2026-02-15"), UpdatedAt: mustParseDate("2026-02-15")},
		{ID: 3, CustomerID: 3, DepositoTypeID: 1, Balance: 55000000, CreatedAt: mustParseDate("2025-03-19"), UpdatedAt: mustParseDate("2025-03-19")},
		{ID: 4, CustomerID: 4, DepositoTypeID: 3, Balance: 30000000, CreatedAt: mustParseDate("2025-08-18"), UpdatedAt: mustParseDate("2025-08-18")},
		{ID: 5, CustomerID: 5, DepositoTypeID: 2, Balance: 71500000, CreatedAt: mustParseDate("2026-01-17"), UpdatedAt: mustParseDate("2026-01-17")},
	}
	for _, account := range accounts {
		var count int64
		db.Model(&entity.Account{}).Where("id = ?", account.ID).Count(&count)
		if count == 0 {
			db.Create(&account)
		}
	}
}

func seedTransactions(db *gorm.DB) {
	zero := 0.0
	transactions := []entity.Transaction{
		{ID: 1, AccountID: 1, TransactionType: "WITHDRAW", Amount: 10000000, TransactionDate: mustParseDate("2026-04-30"), StartingBalance: 160000000, EndingBalance: 150000000, ReturnAmount: &zero, Months: intPtr(3)},
		{ID: 2, AccountID: 2, TransactionType: "DEPOSIT", Amount: 5000000, TransactionDate: mustParseDate("2026-04-30"), StartingBalance: 70000000, EndingBalance: 75000000},
		{ID: 3, AccountID: 3, TransactionType: "DEPOSIT", Amount: 3000000, TransactionDate: mustParseDate("2026-04-30"), StartingBalance: 52000000, EndingBalance: 55000000},
		{ID: 4, AccountID: 4, TransactionType: "WITHDRAW", Amount: 15000000, TransactionDate: mustParseDate("2026-04-30"), StartingBalance: 45000000, EndingBalance: 30770000, ReturnAmount: float64Ptr(770000), Months: intPtr(6)},
		{ID: 5, AccountID: 5, TransactionType: "WITHDRAW", Amount: 20000000, TransactionDate: mustParseDate("2026-04-30"), StartingBalance: 140000000, EndingBalance: 120000000},
	}
	for _, transaction := range transactions {
		var count int64
		db.Model(&entity.Transaction{}).Where("id = ?", transaction.ID).Count(&count)
		if count == 0 {
			db.Create(&transaction)
		}
	}
}

func mustParseDate(value string) time.Time {
	parsed, _ := time.Parse("2006-01-02", value)
	return parsed
}

func float64Ptr(value float64) *float64 {
	return &value
}

func intPtr(value int) *int {
	return &value
}

func resetSequence(db *gorm.DB, tableName string) {
	if db == nil {
		return
	}

	query := "SELECT setval(pg_get_serial_sequence(?, 'id'), COALESCE(MAX(id), 1), true) FROM " + tableName
	_ = db.Exec(query, tableName).Error
}