# Flight Booking Application

A full-stack web application for managing flight bookings with a React frontend and Flask backend.

## Features

- View available flights
- Book flights with passenger details
- Cancel bookings
- Admin panel for managing flights
- Real-time seat availability
- User-friendly interface

## Tech Stack

### Frontend
- React
[Screenshot 2025-10-20 at 10.08.18 PM (1).pdf](https://github.com/user-attachments/files/23005653/Screenshot.2025-10-20.at.10.08.18.PM.1.pdf)

- Vite
- CSS for styling
- Axios for API calls

### Backend
- Flask (Python)
- MySQL database
- Flask-CORS for handling cross-origin requests

## Prerequisites

- Python 3.8+
- Node.js 14+
- MySQL

## Setup

### Database Setup
1. Install MySQL:
```bash
brew install mysql
brew services start mysql
```

2. Create database and tables:
```bash
mysql -u root -p < backend/database.sql
```

### Backend Setup
1. Navigate to backend directory:
```bash
cd frontend/backend
```

2. Create a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Mac/Linux
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=flight_db
```

5. Run the Flask server:
```bash
python app.py
```

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## API Endpoints

### Flights
- GET `/api/flights` - Get all flights
- POST `/api/flights` - Add new flight
- PUT `/api/flights/<id>` - Update flight
- DELETE `/api/flights/<id>` - Delete flight

### Bookings
- POST `/api/book` - Create booking
- GET `/api/bookings` - Get all bookings
- DELETE `/api/cancel/<id>` - Cancel booking

## Project Structure
```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   └── assets/        # Static assets
└── backend/
    ├── app.py         # Flask application
    ├── config.py      # Configuration
    └── database.sql   # Database schema
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License. See `LICENSE` for more information.
