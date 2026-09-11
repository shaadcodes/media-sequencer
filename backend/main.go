package main

import (
	"log"
	"media-sequencer-go-api/config"
	"media-sequencer-go-api/handlers"
	"media-sequencer-go-api/store"
	"media-sequencer-go-api/websockets"
	"net/http"
	"time"

	"github.com/rs/cors"
)

func main() {

	config.LoadConfig()
	store.ConnectDataBase()
	store.SeedDB()

	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", handlers.HealthHandler)
	mux.HandleFunc("GET /api/windows", handlers.GetWindowsHandler)
	mux.HandleFunc("POST /api/windows/{windowId}/media", handlers.AddMediaHandler)
	mux.HandleFunc("POST /api/sync", handlers.TriggerSyncHandler)
	mux.HandleFunc("GET /ws", websockets.HandleConnections)

	cors := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173",
			"https://shaads-media-sequencer.vercel.app"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := cors.Handler(mux)

	server := &http.Server{
		Addr:         ":" + config.PORT,
		Handler:      handler,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}

	log.Printf("Server started on PORT: %s", config.PORT)
}
