package handlers

import (
	"context"
	"encoding/json"
	"log"
	"media-sequencer-go-api/models"
	"media-sequencer-go-api/store"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

func GetWindowsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	collection := store.GetCollection("windows")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "Failed to fetch data from Database!", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	windows := []models.WindowConfig{}
	if err = cursor.All(ctx, &windows); err != nil {
		log.Printf("BSON decoding error: %v", err)

		http.Error(w, "Failed decoding DB response!", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(windows)
}

func AddMediaHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	windowId := r.PathValue("windowId")
	if windowId == "" {
		http.Error(w, "Window ID is required!", http.StatusBadRequest)
		return
	}

	var newItem models.MediaItem
	if err := json.NewDecoder(r.Body).Decode(&newItem); err != nil {
		http.Error(w, "Invalid request body!", http.StatusBadRequest)
		return
	}

	newItem.ID = "m_" + bson.NewObjectID().Hex()

	collection := store.GetCollection("windows")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"windowID": windowId}
	update := bson.M{"$push": bson.M{"playlist": newItem}}

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		http.Error(w, "Failed to update database", http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		http.Error(w, "Window not found!", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newItem)

}
