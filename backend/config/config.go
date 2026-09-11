package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var (
	MongoURI string
	PORT     string
	DB       string
)

func LoadConfig() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, default system variables will be used.")
	}

	MongoURI = os.Getenv("MONGO_URI")
	if MongoURI == "" {
		log.Fatal("MONGO_URI environment variable is required")
	}

	DB = os.Getenv("DB_NAME")
	if DB == "" {
		DB = "media_sequencer_db"
	}

	PORT = os.Getenv("PORT")
	if PORT == "" {
		PORT = "8080"
	}
}
