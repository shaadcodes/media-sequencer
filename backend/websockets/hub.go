package websockets

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

type SyncMessage struct {
	Type     string `json:"type"`
	URL      string `json:"url"`
	Duration int    `json:"duration"`
}

var (
	Upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	clients = make(map[*websocket.Conn]bool)
	mutex   = &sync.Mutex{}
)

func HandleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		return
	}

	mutex.Lock()
	clients[ws] = true
	mutex.Unlock()

	defer func() {
		mutex.Lock()
		delete(clients, ws)
		mutex.Unlock()

		ws.Close()
		log.Println("Display window disconnected!")
	}()

	for {
		_, _, err := ws.ReadMessage()
		if err != nil {
			log.Printf("Error: %v", err)
			break
		}
	}
}

func BroadcastSync(messsage SyncMessage) {
	mutex.Lock()
	defer mutex.Unlock()

	for client := range clients {
		err := client.WriteJSON(messsage)
		if err != nil {
			log.Printf("WebSocket error: %v", err)
			client.Close()
			delete(clients, client)
		}
	}
}
