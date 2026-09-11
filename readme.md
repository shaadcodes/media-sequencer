# Real-Time Media Sequencer & Broadcasting System

A high-performance, full-stack enterprise display and media sequencing dashboard built for multi-screen environments. It features real-time WebSocket synchronization, dynamic playlist management, and persistent cloud storage.

---

## Key Features

**Real-Time WebSocket Synchronization:** Instant global state broadcasting across multiple connected client displays using a custom Go concurrency hub.
**Dynamic Playlist Architecture:** Add, manage, and sequence video, image, and blank-screen elements across arbitrary display windows.
**Persistent State Storage:** Full MongoDB Atlas integration for robust document mapping and state recovery.
**Modern Responsive Interface:** Styled completely with Tailwind CSS, featuring smooth transitions, clean typography, and a reactive control dashboard.
**Production-Ready Deployment:** Hosted live with frontend distribution on Vercel and backend microservices on Railway.

---

## Tech Stack

### **Backend**
**Language:** Go (Golang v1.22)
**Routing:** Native `net/http` ServeMux
**WebSockets:** Gorilla WebSocket (`gorilla/websocket`)
**Database Driver:** MongoDB Go Driver (`mongo-driver/v2`)
**Middleware:** CORS (`rs/cors`), Dotenv (`go-dotenv`)

### **Frontend**
**Framework:** React with Vite & TypeScript
**Styling:** Tailwind CSS
**Form Management:** React Hook Form
**Hosting & CDN:** Vercel

---

## Project Structure

```text
media-sequencer/
├── backend/
│   ├── config/        # Environment and configuration loaders
│   ├── handlers/      # REST API controllers (Windows, Media, Sync, Health)
│   ├── models/        # Go BSON and JSON data structs
│   ├── store/         # Database connection and initial seed logic
│   ├── websockets/    # WebSocket connection manager and sync broadcaster
│   ├── main.go        # Application entry point and router initialization
│   ├── go.mod
│   └── go.sum
└── frontend/
    ├── src/
    │   ├── components/# Modular UI views (ControlPanel, MediaWindow, etc.)
    │   ├── types/     # TypeScript interface definitions
    │   ├── App.tsx    # Core state management and API bindings
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts