from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Database configuration
dbconfig = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "root"),
    "database": os.getenv("DB_NAME", "flight_db"),
    "pool_name": "mypool",
    "pool_size": 5
}

try:
    connection_pool = mysql.connector.pooling.MySQLConnectionPool(**dbconfig)
except mysql.connector.Error as err:
    print(f"Error connecting to database: {err}")
    exit(1)

def get_db_cursor():
    try:
        connection = connection_pool.get_connection()
        cursor = connection.cursor(dictionary=True)
        return connection, cursor
    except mysql.connector.Error as err:
        print(f"Error getting database cursor: {err}")
        return None, None

# ---------------- Flights Endpoints ----------------

# Get all flights
@app.route("/api/flights", methods=["GET"])
def get_flights():
    connection, cursor = get_db_cursor()
    if not cursor:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor.execute("SELECT * FROM flights")
        result = cursor.fetchall()
        return jsonify(result)
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        connection.close()

# Add new flight (Admin)
@app.route("/api/flights", methods=["POST"])
def add_flight():
    data = request.json
    sql = """
        INSERT INTO flights
        (flight_number, airline, departure, destination, available_seats, departure_time, arrival_time, price, duration)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        data['flight_number'], data['airline'], data['departure'], data['destination'],
        data['available_seats'], data['departure_time'], data['arrival_time'], data['price'], data['duration']
    )
    connection, cursor = get_db_cursor()
    if not cursor:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor.execute(sql, values)
        db.commit()
        return jsonify({"success": True, "flight_id": cursor.lastrowid, "message": "Flight added successfully"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        connection.close()

# Update flight (Admin)
@app.route("/api/flights/<int:flight_id>", methods=["PUT"])
def update_flight(flight_id):
    data = request.json
    sql = """
        UPDATE flights
        SET flight_number=%s, airline=%s, departure=%s, destination=%s,
            available_seats=%s, departure_time=%s, arrival_time=%s, price=%s, duration=%s
        WHERE id=%s
    """
    values = (
        data['flight_number'], data['airline'], data['departure'], data['destination'],
        data['available_seats'], data['departure_time'], data['arrival_time'], data['price'], data['duration'],
        flight_id
    )
    connection, cursor = get_db_cursor()
    if not cursor:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor.execute(sql, values)
        db.commit()
        return jsonify({"success": True, "message": "Flight updated successfully"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        connection.close()

# Delete flight (Admin)
@app.route("/api/flights/<int:flight_id>", methods=["DELETE"])
def delete_flight(flight_id):
    connection, cursor = get_db_cursor()
    if not cursor:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor.execute("DELETE FROM flights WHERE id=%s", (flight_id,))
        db.commit()
        if cursor.rowcount:
            return jsonify({"success": True, "message": "Flight deleted successfully"})
        else:
            return jsonify({"success": False, "message": "Flight not found"}), 404
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        connection.close()

# ---------------- Booking Endpoints ----------------

# Book a flight
@app.route("/api/book", methods=["POST"])
def book_flight():
    data = request.json
    sql = """
        INSERT INTO bookings (flight_id, passenger_name, passport_number, email, phone)
        VALUES (%s, %s, %s, %s, %s)
    """
    values = (data['flight_id'], data['passenger_name'], data['passport_number'], data['email'], data['phone'])
    connection, cursor = get_db_cursor()
    if not cursor:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor.execute(sql, values)
        db.commit()
        return jsonify({
            "success": True,
            "booking_id": cursor.lastrowid,
            "detail": "Booking confirmed!"
        })
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        connection.close()

# Get all bookings
@app.route("/api/bookings", methods=["GET"])
def get_bookings():
    connection, cursor = get_db_cursor()
    if not cursor:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor.execute("SELECT * FROM bookings")
        result = cursor.fetchall()
        return jsonify(result)
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        connection.close()

# Cancel/Delete booking by ID
@app.route("/api/cancel/<int:booking_id>", methods=["DELETE", "OPTIONS"])
def cancel_booking(booking_id):
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    connection, cursor = get_db_cursor()
    if not cursor:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor.execute("DELETE FROM bookings WHERE id = %s", (booking_id,))
        db.commit()

        if cursor.rowcount:
            return jsonify({"success": True, "detail": "Booking canceled successfully!"})
        else:
            return jsonify({"success": False, "detail": "Booking ID not found!"}), 404
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        connection.close()

# ---------------- Run Flask App ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
