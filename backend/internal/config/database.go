package config

import (
	"fmt"
	"log"
	"time"

	"github.com/caarlos0/env/v10"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DatabaseConfig struct {
	Host     string `env:"DB_HOST" envDefault:"localhost"`
	Port     int    `env:"DB_PORT" envDefault:"5432"`
	User     string `env:"DB_USER" envDefault:"postgres"`
	Password string `env:"DB_PASSWORD" envDefault:"123how"`
	Name     string `env:"DB_NAME" envDefault:"sava_io_db"`
	SSLMode  string `env:"DB_SSLMODE" envDefault:"disable"`
	TimeZone string `env:"DB_TIMEZONE" envDefault:"Asia/Jakarta"`
	LogLevel string `env:"DB_LOG_LEVEL" envDefault:"silent"`
}

var Database DatabaseConfig

func LoadDatabaseConfig() {
	if err := env.Parse(&Database); err != nil {
		log.Fatal(err)
	}
}

func ConnectDatabase() *gorm.DB {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=%s TimeZone=%s",
		Database.Host,
		Database.User,
		Database.Password,
		Database.Name,
		Database.Port,
		Database.SSLMode,
		Database.TimeZone,
	)

	level := logger.Silent
	switch Database.LogLevel {
	case "info":
		level = logger.Info
	case "warn":
		level = logger.Warn
	case "error":
		level = logger.Error
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{Logger: logger.Default.LogMode(level)})
	if err != nil {
		log.Fatal(err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal(err)
	}

	for attempt := 0; attempt < 10; attempt++ {
		if err := sqlDB.Ping(); err == nil {
			return db
		}
		time.Sleep(2 * time.Second)
	}

	log.Fatal("unable to connect to postgres database")

	return db
}