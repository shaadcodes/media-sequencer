package handlers

import (
	"encoding/json"
	"log"
	"media-sequencer-go-api/websockets"
	"net/http"
)

func TriggerSyncHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var syncData websockets.SyncMessage
	if err := json.NewDecoder(r.Body).Decode(&syncData); err != nil {
		log.Printf("Sync Decode error: %v", err)
		http.Error(w, "Invalid sync data!", http.StatusBadRequest)
		return
	}

	websockets.BroadcastSync(syncData)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "Sync broadcast success!"})
}
