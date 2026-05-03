package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type AppConfig struct {
	Port       int
	CORSOrigins string
}

func Load() AppConfig {
	return AppConfig{
		Port:        getEnvInt("PORT", 3456),
		CORSOrigins: getEnvString("CORS_ORIGIN", "http://localhost:5173"),
	}
}

func (c AppConfig) Address() string {
	return fmt.Sprintf(":%d", c.Port)
}

func getEnvString(key, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}

func getEnvInt(key string, fallback int) int {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}

	parsed, err := strconv.Atoi(value)
	if err != nil {
		return fallback
	}

	return parsed
}