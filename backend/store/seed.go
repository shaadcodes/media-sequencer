package store

import (
	"context"
	"log"
	"media-sequencer-go-api/models"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

func SeedDB() {

	collection := GetCollection("windows")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	count, err := collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		log.Printf("Error checking Database collection: %v", err)
		return
	}

	if count > 0 {
		log.Println("Database is populated, skipping seed data injection...")
		return
	}
	log.Println("Database is empty, injecting seed data...")

	seedData := []interface{}{
		models.WindowConfig{
			WindowId: "window_1",
			Name:     "Lobby Main Display",
			Playlist: []models.MediaItem{
				{ID: "m1", Type: "image", URL: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74", Duration: 10},
				{ID: "m2", Type: "video", URL: "https://www.w3schools.com/html/mov_bbb.mp4", Duration: 15},
				{ID: "m3", Type: "blank", URL: "", Duration: 5},
			},
		},
		models.WindowConfig{
			WindowId: "window_2",
			Name:     "Hallway Screen",
			Playlist: []models.MediaItem{
				{ID: "m4", Type: "video", URL: "https://www.w3schools.com/html/mov_bbb.mp4", Duration: 20},
				{ID: "m5", Type: "image", URL: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba", Duration: 12},
			},
		},
		models.WindowConfig{
			WindowId: "window_3",
			Name:     "Another media window",
			Playlist: []models.MediaItem{
				{ID: "m6", Type: "video", URL: "https://static.videezy.com/system/resources/previews/000/034/550/original/point4.mp4", Duration: 20},
			},
		},
	}

	_, err = collection.InsertMany(ctx, seedData)
	if err != nil {
		log.Fatalf("Failed to seed database: %v", err)
	}

	log.Println("Seeding complete!")
}
