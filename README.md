# Wares Ledger - Modern Inventory Management & Analytics Dashboard

A sleek, responsive, and robust full-stack inventory tracking web application built with React (Vite) on the frontend and a Node.js (Express) REST API backend. Designed for real-time stock monitoring, inventory valuation, dynamic filtering, and custom categorization.

## Key Features

- Real-time Inventory Metrics: Live calculation of total distinct items, aggregate in-stock unit volume, and total portfolio valuation.
- Dark / Light Theme Support: Built-in theme switcher with CSS variables and seamless UI state transitions.
- Custom Color Badging: Integrated color swatch picker inside entry forms for visually categorizing inventory items.
- Intelligent Search & Filtering: Instant text search across item names alongside dynamic category filtering.
- Multi-Criteria Sorting: Sort inventory records by:
  - Item Name (A-Z)
  - Price (Low to High / High to Low)
  - Stock Volume (Low to High)
  - Product Rating (High to Low)
- Complete CRUD Capabilities:
  - Create: Add new stock records with custom colors and attributes via a slide-over modal drawer.
  - Read: Product cards showcasing star ratings, unit pricing, stock indicators, and low-stock alerts.
  - Update: Edit existing inventory parameters in real time.
  - Delete: Remove deprecated items with instant backend state update.
- Interactive Toast Feedback: Non-intrusive toast notification system for save, edit, delete, and connection state alerts.

## Tech Stack & Architecture

### Frontend:
- Framework: React 18 (Vite)
- Styling: Custom CSS3 (Glassmorphism design, CSS Variables, Responsive Grid)
- Typography & Icons: Plus Jakarta Sans (Google Fonts)

### Backend:
- Runtime Environment: Node.js
- Web Framework: Express.js
- API Architecture: RESTful Endpoints (GET, POST, PUT, DELETE)
- Middleware: CORS, Express JSON Body Parser

## Repository Structure

wares-ledger/
├── backend/
│   ├── server.js          # Express REST API server & state handling
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React dashboard & UI state
│   │   ├── index.css      # Design system, themes & custom CSS
│   │   └── main.jsx       # Vite app entry point
│   ├── index.html         # HTML template
│   └── package.json       # Frontend dependencies
├── .gitignore             # Environment & node_modules exclusion rules
└── README.md              # Project documentation

## Local Development Setup

### Prerequisites:
- Node.js (v18 or higher recommended)
- Git installed on your system

### 1. Clone the Repository
```bash
git clone [https://github.com/sukhvinder254/wares-ledger.git](https://github.com/sukhvinder254/wares-ledger.git)
cd wares-ledger

2. Start Backend Server
Open a terminal in the root directory:
cd backend
npm install
node server.js

Note: The Express REST API will run at http://localhost:5000
3. Start Frontend App
Open a secondary terminal window in the root directory:
cd frontend
npm install
npm run dev

Note: The React/Vite development server will launch at http://localhost:5173 or http://localhost:5174
API Reference
| Endpoint | Method | Description |
|---|---|---|
| /products | GET | Fetch all inventory items |
| /products | POST | Create a new inventory record |
| /products/:id | PUT | Update existing product details |
| /products/:id | DELETE | Remove a product from the ledger |
Author
Developed by Sukhvinder Kaur
