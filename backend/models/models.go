package models

import "go.mongodb.org/mongo-driver/v2/bson"

type MediaItem struct {
	ID       string `json:"id" bson:"id"`
	Type     string `json:"type" bson:"type"`
	URL      string `json:"url" bson:"url"`
	Duration int    `json:"duration" bson:"duration"`
}

type WindowConfig struct {
	ID       bson.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	WindowId string        `json:"windowId" bson:"windowID"`
	Name     string        `json:"name" bson:"name"`
	Playlist []MediaItem   `json:"playlist" bson:"playlist"`
}
