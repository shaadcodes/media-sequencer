package store

import (
	"context"
	"log"
	"time"

	"media-sequencer-go-api/config"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var DB *mongo.Database

func ConnectDataBase() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(config.MongoURI)
	client, err := mongo.Connect(clientOptions)
	if err != nil {
		log.Fatalf("Failed to connect to Database: %v", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}

	log.Println("Connected to MongoDB Cluster!")

	DB = client.Database(config.DB)
}

func GetCollection(collectionName string) *mongo.Collection {
	return DB.Collection(collectionName)
}
